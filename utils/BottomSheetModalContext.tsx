import React, { createContext, useState } from 'react';
import { Button, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

type BottomSheetContextType = {
  toggleBottomSheetModal: (content?: React.ReactNode) => void;
};

export const BottomSheetModalContext = createContext<BottomSheetContextType>({ toggleBottomSheetModal: () => {} });

export const BottomSheetModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const [isOpen, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const toggleBottomSheetModal = (content?: React.ReactNode) => {
    if (content !== undefined) {
      setContent(content);
      setOpen(true);
    } else {
      setOpen(prev => !prev);
    }
  };

  return (
    <BottomSheetModalContext.Provider value={{ toggleBottomSheetModal }}>
      {children}
      {isOpen && (
        <>
          <AnimatedPressable
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.backdrop}
            onPress={() => toggleBottomSheetModal()}
          />
          <Animated.View
            style={styles.sheet}
            entering={SlideInDown}
            exiting={SlideOutDown}
          >
            <Button title="とじる" onPress={() => toggleBottomSheetModal()} />
            {content}
          </Animated.View>
        </>
      )}
    </BottomSheetModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: 'white',
    padding: 16,
    height: '90%',
    width: '100%',
    position: 'absolute',
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
});
