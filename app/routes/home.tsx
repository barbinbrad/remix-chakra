import {
  chakra,
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  VStack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";
import { Link, useMatches } from "@remix-run/react";
import { AiOutlineMenu } from "react-icons/ai";

type Route = {
  to: string;
  description: string;
};

const routes: Route[] = [
  {
    to: "/home/overview",
    description: "Overview",
  },
  {
    to: "/home/files",
    description: "Files",
  },
  {
    to: "/home/forms",
    description: "Forms",
  },
  {
    to: "/home/videos",
    description: "Videos",
  },
  {
    to: "/home/links",
    description: "Web Links",
  },
];

export default function HomeRoute() {
  const matches = useMatches();
  const hasMatch = (route: string) => {
    const matchingRoute = matches.find((match) => match.pathname === route);
    return matchingRoute !== undefined;
  };

  const mobileNav = useDisclosure();

  return (
    <Box w="full" h="full">
      <Flex w="full">
        <chakra.header
          bg="whiteAlpha.100"
          w="full"
          px={{ base: 2, sm: 4 }}
          py={2}
          shadow="md"
        >
          <Flex alignItems="center" justifyContent="space-between" mx="auto">
            <HStack display="flex" spacing={3} alignItems="center">
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
                  bg="whiteAlpha.100"
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
                        variant={routeMatches ? "outline" : "ghost"}
                        colorScheme={routeMatches ? "gray" : undefined}
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
                      variant={routeMatches ? "outline" : "ghost"}
                      colorScheme={routeMatches ? "gray" : undefined}
                    >
                      {route.description}
                    </Button>
                  );
                })}
              </HStack>
            </HStack>
          </Flex>
        </chakra.header>
      </Flex>
      <Flex grow={1}>
        <Outlet />
      </Flex>
    </Box>
  );
}
