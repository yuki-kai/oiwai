import React, { createContext, useState } from 'react';
import { Button, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import { themes } from '@/constants/ColorTheme';

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
            <Animated.View style={styles.header}>
              <Button 
                title="閉じる" 
                onPress={() => toggleBottomSheetModal()} 
                color={themes.default.Text.primary}
              />
            </Animated.View>
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
    height: '95%',
    width: '100%',
    position: 'absolute',
    bottom: -20 * 1.1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1,
  },
  header: {
    backgroundColor: themes.default.Backgroud.primary,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
});
