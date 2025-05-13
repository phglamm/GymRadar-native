import { Dimensions, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { Image } from "react-native";
import { useRef } from "react";
import { useSharedValue } from "react-native-reanimated";

export default function CarouselNative({
  width,
  height,
  autoPlay,
  data,
  scrollAnimationDuration,
  style,
}) {
  const ref = useRef(null);
  const progress = useSharedValue(0);

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <>
      <Carousel
        ref={ref}
        loop
        width={width}
        height={height}
        autoPlay={autoPlay}
        onProgressChange={progress}
        data={data}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item?.url }}
            style={[styles.image, { width }, { height }]}
          />
        )}
        style={style}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{
          backgroundColor: "#FFFFFF",
          borderRadius: 50,
          borderWidth: 1,
          borderColor: "#D5E9EC",
        }}
        activeDotStyle={{
          overflow: "hidden",
          backgroundColor: "#EA4C2D",
          borderWidth: 1,
          borderColor: "#EA4C2D",
        }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    height: "100%",
    resizeMode: "cover",
    alignSelf: "center",
  },
});
