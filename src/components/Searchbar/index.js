import React from 'react'
import { Container, SearchBarTextInput } from './styles';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
export default function SearchBar({
  children,
  onChangeText,
  returnKeyType,
  value,
}) {
  const { t, i18n } = useTranslation();
  // ---------------------------------------------------------------------------
  return (
    <SearchBarTextInput
      placeholder={t('Search')}
      onChangeText={onChangeText}
      returnKeyType={returnKeyType}
      value={value}
    />
  )
}
