'use client';

import { FieldNumberInput } from '@/components/mui-treasury/field-number-input';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import './caps.css';

const CREDIT_RATIO = 2;
const AVG_COMPLEXITY = 3;

const INDUSTRIES = {
    SOFTWARE: {
        key: 'SOFTWARE',
        value: 1.5,
    },
    WEB_DESIGN: {
        key: 'WEB_DESIGN',
        value: 1.5,
    },
    BUSINESS_ANALYSIS: {
        key: 'BUSINESS_ANALYSIS',
        value: 1.5,
    }
};

export default function TrelloCapsPage() {
    const t = useTranslations('trello');

    const [cardState, setCardState] = useState({
        effort: 0,
        complexity: 3,
        industry: INDUSTRIES.SOFTWARE.key,
        definedCaps: null
    });

    const [trelloService, setTrelloService] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.TrelloPowerUp) {
            const tService = window.TrelloPowerUp.iframe();
            tService.render(function () {
                return tService.get('card', 'shared', 'capsParams')
                    .then(function (capsParams) {
                        const { effort, complexity, industry, caps } = capsParams;
                        setCardState({ ...cardState, effort, complexity, industry, definedCaps: caps });
                    })
                    .then(function () {
                        tService.sizeTo('#caps').done();
                    });
            });
            setTrelloService(tService);
        }
    }, []);

    const onNumberInputChange = (fieldName: string) => (value: number) => {
        setCardState({ ...cardState, [fieldName]: value });
    };

    const onStringInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target?.value;
        setCardState({ ...cardState, [fieldName]: inputValue });
    };

    const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (trelloService != null) {
            trelloService.set('card', 'shared', 'capsParams', {
                effort: cardState.effort,
                complexity: cardState.complexity,
                industry: cardState.industry,
                caps: _calcCaps(cardState),
            }).then(function () {
                trelloService.closePopup();
            });
        } else {
            console.log('Trello service not available');
        }
    };

    const _calcCaps = ({ effort, complexity, industry }: { effort: number, complexity: number, industry: string }) => {
        return (effort / CREDIT_RATIO) * (complexity / AVG_COMPLEXITY) * INDUSTRIES[industry as keyof typeof INDUSTRIES].value;
    };

    return (
        <Container id='caps' className='Trello__Caps Container' maxWidth="sm">
            <form className='Form' id="caps" onSubmit={onSubmit}>
                <FormControl fullWidth key="effort" id="effort" className="InputField Effort">
                    <InputLabel
                        className="Label" id="effort-label">{t('caps.form.effort')}</InputLabel>
                    <FieldNumberInput
                        className="Input"
                        id="effort"
                        fullWidth
                        value={cardState.effort}
                        onChange={onNumberInputChange('effort')}
                        min="0"
                        max="30"
                        step="0.5"
                        precision="1"
                    />
                </FormControl >

                <FormControl fullWidth key="complexity"
                    id="complexity" className="InputField Complexity">
                    <InputLabel
                        className="Label" id="complexity-label">{t('caps.form.complexity')}</InputLabel>
                    <FieldNumberInput
                        className="Input"
                        id="complexity"
                        fullWidth
                        value={cardState.complexity}
                        onChange={onNumberInputChange('complexity')}
                        min="1"
                        max="5"
                        step="1"
                        precision="0"
                    />
                </FormControl>

                <FormControl fullWidth key="industry"
                    id="industry" className="InputField Industry">
                    <InputLabel
                        className="Label" id="industry-label">{t('caps.form.industry')}</InputLabel>
                    <Select
                        labelId="industry-label"
                        id="industry"
                        className="Input"
                        fullWidth
                        value={cardState.industry}
                        onChange={onStringInputChange('industry')}
                    >
                        {Object.keys(INDUSTRIES).map((key) => (<MenuItem key={key} value={key}>{t(`caps.form.industries.${key}`)}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth key="caps" id="resultingCaps" className="InputField">
                    <TextField
                        className="Input"
                        label={t('caps.form.resultingCaps')}
                        id="resultingCaps"
                        fullWidth
                        disabled
                        value={_calcCaps(cardState)}
                    />
                </FormControl>
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    className="mod-primary">
                    {t('caps.form.submit')}
                </Button>
            </form>
        </Container>
    );
}