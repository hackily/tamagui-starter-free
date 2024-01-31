import {
  Anchor,
  Button,
  H1,
  Paragraph,
  Separator,
  Sheet,
  useToastController,
  XStack,
  YStack,
  styled,
  Theme,
  useThemeName,
  useTheme,
  MyAside,
  MySheet,
} from '@my/ui'
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { useLink } from 'solito/link'

export function HomeScreen() {
  const linkProps = useLink({
    href: '/user/nate',
  })
  const theme = useTheme()
  const themeName = useThemeName()

  return (
    <YStack f={1} jc="center" ai="center" p="$4" width="100%" height="100%">
      <YStack space="$4" bc="$background" gap="$2">
        <H1 ta="center">Click to open the sheet</H1>
        <Paragraph>
          The default theme has been set to "light_custom" in the tamagui provider, which provides
          $backgroundAccent and $colorAccent colors.
        </Paragraph>
        <Paragraph>
          The theme returned from useThemeName() in the HomeScreen component is {themeName}
        </Paragraph>
        <MyAside>
          <Paragraph>$backgroundAccent: {JSON.stringify(theme.$backgroundAccent)}</Paragraph>
        </MyAside>
        <MyAside>
          <Paragraph color="$colorAccent">
            $colorAccent: {JSON.stringify(theme.$colorAccent)}
          </Paragraph>
        </MyAside>
      </YStack>
      <SheetDemo />
    </YStack>
  )
}

function SheetDemo() {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const toast = useToastController()

  const theme = useTheme()
  const themeName = useThemeName()
  return (
    <>
      <Button
        size="$6"
        icon={open ? ChevronDown : ChevronUp}
        circular
        onPress={() => setOpen((x) => !x)}
      />
      <MySheet open={open}>
        <YStack gap="$2">
          <Paragraph>
            The theme returned from useThemeName() in the HomeScreen component is {themeName}
          </Paragraph>
          <MyAside>
            <Paragraph>$backgroundAccent: {JSON.stringify(theme.$backgroundAccent)}</Paragraph>
          </MyAside>
          <MyAside>
            <Paragraph color="$colorAccent">
              $colorAccent: {JSON.stringify(theme.$colorAccent)}
            </Paragraph>
          </MyAside>
          <Button
            size="$6"
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          >
            Close
          </Button>
        </YStack>
      </MySheet>
    </>
  )
}
