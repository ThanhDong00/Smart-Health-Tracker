import { Image } from "react-native";

const PostAvatar = () => {
  return (
    <Image
      source={{
        uri: "https://i.pravatar.cc/300",
      }}
      className="w-full h-full"
      resizeMode="cover"
    />
  );
};

export default PostAvatar;
