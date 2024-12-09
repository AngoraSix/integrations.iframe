'use client';

import {useTranslations} from 'next-intl';
import { useTrelloPowerUp } from '@/hooks/trello/useTrelloPowerUp';
import { Button, Container, Typography } from '@mui/material';

export default function TrelloPopupPage() {
    const trello = useTrelloPowerUp();
    const t = useTranslations('trello');

    const handleSubmit = async () => {
        if (trello) {
            const data = await trello.get('card', 'shared', 'keyName');
            console.log('Current value:', data);

            await trello.set('card', 'shared', 'keyName', 'newValue');
            trello.closePopup();
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="body2" gutterBottom>
                {t('caps.form.effort')}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                {t('caps.form.submit')}
            </Button>
        </Container>
    );
}