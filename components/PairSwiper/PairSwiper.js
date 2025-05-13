import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Swiper from "react-native-swiper";

/**
 * A reusable swiper component that displays items in pairs per slide
 *
 * @param {Object} props
 * @param {Array} props.data - Array of data items to display
 * @param {Function} props.renderItem - Function to render each item (receives item as parameter)
 * @param {number} props.itemsPerSlide - Number of items to display per slide (default: 2)
 * @param {Object} props.containerStyle - Additional styles for the container
 * @param {Object} props.slideStyle - Additional styles for each slide
 * @param {Object} props.itemContainerStyle - Additional styles for each item container
 * @param {boolean} props.autoplay - Whether to autoplay the swiper (default: false)
 * @param {number} props.autoplayTimeout - Timeout for autoplay in seconds (default: 3)
 * @param {boolean} props.loop - Whether to loop the swiper (default: true)
 * @param {number} props.height - Height of the swiper (default: 240)
 * @param {Object} props.dotStyle - Custom style for pagination dots
 * @param {Object} props.activeDotStyle - Custom style for active pagination dot
 * @param {boolean} props.showsButtons - Whether to show navigation buttons (default: false)
 */
const PairedSwiper = ({
  data = [],
  renderItem,
  itemsPerSlide = 2,
  containerStyle = {},
  slideStyle = {},
  itemContainerStyle = {},
  autoplay = false,
  autoplayTimeout = 3,
  loop = true,
  height = 240,
  dotStyle = {},
  activeDotStyle = {},
  showsButtons = false,
  showsPagination = false,
}) => {
  // Group items into arrays of itemsPerSlide
  const getItemGroups = () => {
    const groups = [];
    for (let i = 0; i < data.length; i += itemsPerSlide) {
      groups.push(data.slice(i, i + itemsPerSlide));
    }
    return groups;
  };

  const itemGroups = getItemGroups();

  const { width } = Dimensions.get("window");
  const itemWidth = (width - 40 - (itemsPerSlide - 1) * 10) / itemsPerSlide;

  return (
    <View style={[styles.container, containerStyle]}>
      <Swiper
        showsButtons={showsButtons}
        showsPagination={showsPagination}
        dotStyle={[styles.dot, dotStyle]}
        activeDotStyle={[styles.activeDot, activeDotStyle]}
        paginationStyle={styles.pagination}
        loop={loop}
        autoplay={autoplay}
        autoplayTimeout={autoplayTimeout}
        height={height}
      >
        {itemGroups.map((group, index) => (
          <View key={index} style={[styles.slide, slideStyle]}>
            {group.map((item, idx) => (
              <View
                key={item.id || idx}
                style={[
                  styles.itemContainer,
                  { width: itemWidth },
                  itemContainerStyle,
                ]}
              >
                {renderItem(item)}
              </View>
            ))}
          </View>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  itemContainer: {},
  dot: {
    backgroundColor: "#D9D9D9",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: "#ED2A46",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  pagination: {
    bottom: 0,
  },
});

export default PairedSwiper;
