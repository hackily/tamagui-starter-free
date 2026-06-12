'use client'

import {
  Button,
  H1,
  Input,
  Paragraph,
  SwitchThemeButton,
  XStack,
  YStack,
} from '@my/ui'
import { Controller, useForm } from 'react-hook-form'
import { Platform } from 'react-native'
import { useState } from 'react'
import type { CSSProperties } from 'react'

type CheckoutValues = {
  firstName: string
  lastName: string
  email: string
  address: string
}

type FieldName = keyof CheckoutValues

const emptyCheckoutDetails: CheckoutValues = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
}

const savedCheckoutDetails: CheckoutValues = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: '',
  address: '123 Main St',
}

export function HomeScreen() {
  return (
    <YStack flex={1} bg="$background" p="$4" gap="$5">
      <XStack width="100%" justify="flex-end" gap="$3" flexWrap="wrap">
        {Platform.OS === 'web' && <SwitchThemeButton />}
      </XStack>

      <YStack gap="$4" maxW={1040} width="100%" mx="auto">
        <YStack gap="$2">
          <H1 color="$color12">Tamagui Input loses RHF field ref after reset</H1>
          <Paragraph color="$color10">
            Expected behavior: The form should focus the first invalid field when the user tries to continue
            to payment. Both panels use the same React Hook Form Controller setup; only the input
            component changes.
          </Paragraph>
        </YStack>

        <YStack gap="$2" bg="$color2" p="$4" borderWidth={1} borderColor="$borderColor">
          <Paragraph size="$6" color="$color12">
            Reproduction steps
          </Paragraph>
          <Paragraph color="$color10">
            1. Click Submit first. When there are validation errors, the RHF form is configured to auto-focus the first field with an error.
          </Paragraph>
          <Paragraph color="$color10">
            2. Click Load saved details, which calls reset(savedDetails). Saved details fill every
            field except Email.
          </Paragraph>
          <Paragraph color="$color10">
            3. Click Submit again. RHF should now focus Email, but Tamagui Input does
            not receive focus after reset.
          </Paragraph>
          <Paragraph color="$color10">
            Clear form calls reset(emptyValues), and the Tamagui form will again not autofocus.
          </Paragraph>
        </YStack>
      </YStack>

      <XStack
        gap="$4"
        maxW={1040}
        width="100%"
        mx="auto"
        flexWrap="wrap"
        items="stretch"
      >
        <CheckoutPanel kind="plain" title="Native input checkout" />
        <CheckoutPanel kind="tamagui" title="Tamagui Input checkout" />
      </XStack>
    </YStack>
  )
}

function CheckoutPanel({ kind, title }: { kind: 'plain' | 'tamagui'; title: string }) {
  const form = useForm<CheckoutValues>({
    defaultValues: emptyCheckoutDetails,
    shouldFocusError: true,
  })
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)

  const resetCheckout = (nextValues: CheckoutValues) => {
    setFocusedField(null)
    // This reset call is the trigger. After it runs, RHF should still be able to
    // focus the first required field with a validation error on submit.
    form.reset(nextValues)
  }

  const submit = form.handleSubmit(
    () => {},
    () => {}
  )

  const errors = form.formState.errors

  return (
    <YStack
      flex={1}
      minW={340}
      borderWidth={1}
      borderColor="$borderColor"
      p="$4"
      gap="$4"
      bg="$color2"
    >
      <YStack gap="$1">
        <Paragraph size="$7" color="$color12">
          {title}
        </Paragraph>
        <Paragraph color="$color10">
          {kind === 'plain'
            ? 'Control: a native input keeps a focusable RHF ref after reset.'
            : 'Bug: Tamagui Input leaves RHF with a non-focusable field ref after reset.'}
        </Paragraph>
      </YStack>

      <YStack gap="$3">
        <CheckoutField
          control={form.control}
          error={errors.firstName?.message}
          focused={focusedField === 'firstName'}
          kind={kind}
          label="First name"
          name="firstName"
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('firstName')}
        />
        <CheckoutField
          control={form.control}
          error={errors.lastName?.message}
          focused={focusedField === 'lastName'}
          kind={kind}
          label="Last name"
          name="lastName"
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('lastName')}
        />
        <CheckoutField
          control={form.control}
          error={errors.email?.message}
          focused={focusedField === 'email'}
          kind={kind}
          label="Email"
          name="email"
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('email')}
        />
        <CheckoutField
          control={form.control}
          error={errors.address?.message}
          focused={focusedField === 'address'}
          kind={kind}
          label="Shipping address"
          name="address"
          onBlur={() => setFocusedField(null)}
          onFocus={() => setFocusedField('address')}
        />
      </YStack>

      <XStack gap="$3" flexWrap="wrap">
        <Button onPress={() => resetCheckout(savedCheckoutDetails)}>
          Load saved details
        </Button>
        <Button onPress={() => resetCheckout(emptyCheckoutDetails)}>
          Clear form
        </Button>
        <Button onPress={() => void submit()}>Submit</Button>
      </XStack>
    </YStack>
  )
}

function CheckoutField({
  control,
  error,
  focused,
  kind,
  label,
  name,
  onBlur,
  onFocus,
}: {
  control: ReturnType<typeof useForm<CheckoutValues>>['control']
  error?: string
  focused: boolean
  kind: 'plain' | 'tamagui'
  label: string
  name: FieldName
  onBlur: () => void
  onFocus: () => void
}) {
  return (
    <YStack gap="$1">
      <Paragraph color="$color12">{label}</Paragraph>
      <Controller
        control={control}
        name={name}
        rules={{ required: `${label} is required` }}
        render={({ field }) =>
          kind === 'plain' ? (
            <input
              aria-invalid={!!error}
              id={`${kind}-${name}`}
              name={field.name}
              onBlur={() => {
                onBlur()
                field.onBlur()
              }}
              onChange={field.onChange}
              onFocus={onFocus}
              // Native input control case: RHF receives the host input node again after reset.
              ref={field.ref}
              value={field.value ?? ''}
              style={getPlainInputStyle(focused, !!error)}
            />
          ) : (
            <Input
              aria-invalid={!!error}
              borderColor={focused ? '$blue10' : error ? '$red10' : '$borderColor'}
              borderWidth={2}
              id={`${kind}-${name}`}
              name={field.name}
              onBlur={() => {
                onBlur()
                field.onBlur()
              }}
              onChangeText={field.onChange}
              onFocus={onFocus}
              // Failing case: after reset, Tamagui Input does not re-deliver the
              // host input node to this RHF ref, so shouldFocusError cannot focus it.
              ref={field.ref}
              style={focused ? focusedInputRingStyle : undefined}
              value={field.value ?? ''}
            />
          )
        }
      />
      {error && (
        <Paragraph color="$red10" size="$3">
          {error}
        </Paragraph>
      )}
    </YStack>
  )
}

function getPlainInputStyle(focused: boolean, error: boolean): CSSProperties {
  return {
    ...plainInputStyle,
    borderColor: focused ? '#0a84ff' : error ? '#d92d20' : 'var(--borderColor, #999)',
    boxShadow: focused ? '0 0 0 3px rgba(10, 132, 255, 0.35)' : 'none',
  }
}

const plainInputStyle = {
  minHeight: 44,
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'var(--borderColor, #999)',
  borderRadius: 6,
  padding: '0 12px',
  font: 'inherit',
  color: 'inherit',
  background: 'transparent',
  outline: 'none',
} satisfies CSSProperties

const focusedInputRingStyle = {
  boxShadow: '0 0 0 3px rgba(10, 132, 255, 0.35)',
  outline: 'none',
} satisfies CSSProperties
