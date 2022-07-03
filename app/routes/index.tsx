import { Text } from "@chakra-ui/react";
import { Outlet } from "@remix-run/react";

const Index = () => {
  return (
    <>
      <Text>Home</Text>
      <Outlet />
    </>
  );
};

export default Index;
