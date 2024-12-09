'use client';

import {useTranslations} from 'next-intl';
import { Button, Typography, Container } from '@mui/material';

export default function TrelloPowerUpPage() {
  const t = useTranslations('trello');

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {t('caps.form.effort')}
      </Typography>
    </Container>
  );
}