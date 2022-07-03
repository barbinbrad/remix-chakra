import {
  chakra,
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Tooltip,
  VisuallyHidden,
  useColorModeValue,
  useColorMode as useChakraColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { useCallback } from "react";
import {
  AiOutlineMenu,
  AiOutlineInbox,
  AiOutlineTeam,
  AiTwotoneSetting,
} from "react-icons/ai";
import { BiSupport, BiLogOut } from "react-icons/bi";
import { BsCalendar3, BsChatDots, BsBook } from "react-icons/bs";
import { FaGraduationCap, FaUserFriends } from "react-icons/fa";
import { ImHome3 } from "react-icons/im";
import { MdBrightnessLow, MdOutlineBrightness2 } from "react-icons/md";
import { Mode, useColorMode } from "~/lib/theme";

type Route = {
  to: string;
  description: string;
  icon: JSX.Element;
};

const routes: Route[] = [
  {
    to: "/home",
    description: "Dashboard",
    icon: <ImHome3 />,
  },
  {
    to: "/calendar",
    description: "Calendar",
    icon: <BsCalendar3 />,
  },
  {
    to: "/profiles",
    description: "Profiles",
    icon: <FaUserFriends />,
  },
  {
    to: "/messaging",
    description: "Messaging",
    icon: <AiOutlineInbox />,
  },
];

export default function Navigation() {
  const matches = useMatches();
  const { setColorMode: setChakraInternalColorMode } = useChakraColorMode();
  const hasMatch = (route: string) => {
    const matchingRoute = matches.find((match) => match.pathname === route);
    return matchingRoute !== undefined;
  };

  const bg = useColorModeValue("white", "black");
  const mobileNav = useDisclosure();
  const [colorMode, setColorMode] = useColorMode();

  const toggleColorMode = useCallback(() => {
    setColorMode((prevMode) => {
      const newMode = prevMode === Mode.Light ? Mode.Dark : Mode.Light;
      setChakraInternalColorMode(newMode);
      return newMode;
    });
  }, [setColorMode, setChakraInternalColorMode]);

  return (
    <chakra.header bg={bg} w="full" px={{ base: 2, sm: 4 }} py={3} shadow="md">
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <HStack display="flex" spacing={3} alignItems="center">
          <chakra.a
            href="/"
            title="Organization"
            display="flex"
            alignItems="center"
          >
            <Image
              alt="Logo"
              src="https://images-teamworksapp.s3.amazonaws.com/36/organizationLogo/150w/24105218-0860-407A-8BA5-84CB4B7FF27B.png"
              boxSize="40px"
            />
            <VisuallyHidden>Organization</VisuallyHidden>
          </chakra.a>

          <Box display={{ base: "inline-flex", md: "none" }} zIndex={999}>
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open menu"
              fontSize="20px"
              color={useColorModeValue("gray.800", "inherit")}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />
            <VStack
              pos="absolute"
              top={0}
              left={0}
              right={0}
              display={mobileNav.isOpen ? "flex" : "none"}
              flexDirection="column"
              p={2}
              pb={4}
              m={2}
              bg={bg}
              spacing={3}
              rounded="sm"
              shadow="sm"
            >
              <CloseButton
                aria-label="Close menu"
                justifySelf="self-start"
                onClick={mobileNav.onClose}
              />
              {routes.map((route) => {
                const routeMatches = hasMatch(route.to);
                return (
                  <Button
                    key={route.description}
                    as={Link}
                    to={route.to}
                    w="full"
                    variant={routeMatches ? "solid" : "ghost"}
                    colorScheme={routeMatches ? "brand" : undefined}
                    leftIcon={route.icon}
                  >
                    Messaging
                  </Button>
                );
              })}
            </VStack>
          </Box>

          <HStack spacing={2} display={{ base: "none", md: "inline-flex" }}>
            {routes.map((route) => {
              const routeMatches = hasMatch(route.to);
              return (
                <Button
                  key={route.description}
                  as={Link}
                  to={route.to}
                  size="sm"
                  variant={routeMatches ? "solid" : "ghost"}
                  colorScheme={routeMatches ? "brand" : undefined}
                  leftIcon={route.icon}
                >
                  {route.description}
                </Button>
              );
            })}
          </HStack>
        </HStack>
        <HStack
          spacing={3}
          display={mobileNav.isOpen ? "none" : "flex"}
          alignItems="center"
        >
          <Menu>
            <MenuButton>
              <IconButton
                as="span"
                role="button"
                aria-label="Support"
                icon={<BiSupport />}
              />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<BsChatDots />}>Chat with Support</MenuItem>
              <MenuItem icon={<BsBook />}>Help Center</MenuItem>
              <MenuItem icon={<FaGraduationCap />}>Learning Portal</MenuItem>
            </MenuList>
          </Menu>

          <Tooltip label={colorMode !== Mode.Dark ? "Dark Mode" : "Light Mode"}>
            <IconButton
              aria-label="Toggle Dark Mode"
              onClick={toggleColorMode}
              icon={
                colorMode !== Mode.Dark ? (
                  <MdOutlineBrightness2 />
                ) : (
                  <MdBrightnessLow />
                )
              }
            />
          </Tooltip>

          <Menu>
            <MenuButton>
              <Avatar size="sm" name="Brad Barbin" />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<AiOutlineTeam />}>Change Account</MenuItem>
              <MenuItem icon={<AiTwotoneSetting />}>Personal Settings</MenuItem>
              <MenuItem icon={<BiLogOut />}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </chakra.header>
  );
}
