import React from 'react'
import { Button, XStack, Spacer, ScrollView, GetProps, H4, Sheet, YStack } from 'tamagui'
import { ChevronLeft, X } from '@tamagui/lucide-icons'

const Content = ({
  children,
  onBack,
  onClose,
  title,
  ...props
}: {
  onBack?: (e) => void
  onClose?: (e) => void
  open: boolean
  title?: string
  children: React.ReactNode
} & GetProps<typeof ScrollView>) => (
  <>
    <XStack justifyContent="space-between" alignItems="center">
      {onBack ? (
        <Button onPress={onBack} aria-label="Go back">
          <ChevronLeft />
        </Button>
      ) : (
        <Spacer width="$4" />
      )}
      {title ? <H4 textAlign="center">{title}</H4> : <Spacer />}
      {onClose ? (
        <Button onPress={onClose} aria-label="Close">
          <X />
        </Button>
      ) : (
        <Spacer width="$4" />
      )}
    </XStack>
    <ScrollView flex={1} paddingHorizontal="$250" {...props}>
      {children}
    </ScrollView>
  </>
)

export const MySheet = ({
  children,
  enableDrag = true,
  onBack,
  onClose,
  open,
  disableDrag,
  showCloseButton = true,
  showHandle = true,
  snapPoints = [90],
  snapPointsMode,
  title,
  ...props
}: {
  enableDrag?: boolean
  showHandle?: boolean
  onBack?: (e) => void
  onClose: (e) => void
  showCloseButton?: boolean
  title?: string
} & GetProps<typeof Sheet>) => {
  return (
    <Sheet
      open={open}
      snapPoints={snapPoints}
      snapPointsMode={snapPointsMode}
      disableDrag={!enableDrag}
      onOpenChange={onClose}
      dismissOnSnapToBottom
      modal
    >
      <Sheet.Overlay animation="lazy" />
      {showHandle && <Sheet.Handle />}
      <Sheet.Frame debug>
        <Content
          {...props}
          onClose={showCloseButton ? onClose : undefined}
          onBack={onBack}
          title={title}
        >
          {children}
        </Content>
      </Sheet.Frame>
    </Sheet>
  )
}
