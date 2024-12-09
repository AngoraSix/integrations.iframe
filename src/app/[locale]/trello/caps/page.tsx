'use client';

import { FieldNumberInput } from '@/components/mui-treasury/field-number-input';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import './caps.css';

const CREDIT_RATIO = 2;
const AVG_COMPLEXITY = 3;

const MODIFIERS = {
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
        modifier: MODIFIERS.SOFTWARE.key
    });

    const onNumberInputChange = (fieldName: string) => (value: number) => {
        setCardState({ ...cardState, [fieldName]: value });
    };

    const onStringInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target?.value;
        setCardState({ ...cardState, [fieldName]: inputValue });
    };


    const _calcCaps = (ef: number, com: number, modif: string) => {
        return (ef / CREDIT_RATIO) * (com / AVG_COMPLEXITY) * MODIFIERS[modif as keyof typeof MODIFIERS].value;
    };

    return (
        <Container className='Trello__Caps Container' maxWidth="sm">
            <form className='Form' id="caps">
                <FormControl fullWidth key="effort" id="effort" className="InputField Effort">
                    <InputLabel
                        className="Label" id="effort-label">{t('caps.form.effort')}</InputLabel>
                    <FieldNumberInput
                        className="Input"
                        labelId="effort-label"
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
                        labelId="commplexity-label"
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

                <FormControl fullWidth key="modifier"
                    id="modifier" className="InputField Modifier">
                    <InputLabel
                        className="Label" id="modifier-label">{t('caps.form.modifier')}</InputLabel>
                    <Select
                        labelId="modifier-label"
                        id="modifier"
                        className="Input"
                        fullWidth
                        value={cardState.modifier}
                        onChange={onStringInputChange('modifier')}
                    >
                        {Object.keys(MODIFIERS).map((key) => (<MenuItem key={key} value={key}>{t(`caps.form.modifiers.${key}`)}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth key="caps" id="resultingCaps" className="InputField">
                    <TextField
                        className="Input"
                        label={t('caps.form.resultingCaps')}
                        id="resultingCaps"
                        fullWidth
                        disabled
                        value={_calcCaps(cardState.effort, cardState.complexity, cardState.modifier)}
                    // // step="0.01"
                    // precision="2"
                    />
                </FormControl>

                {/* <label for="complexity">Complexity (1-5):</label>
      <input
        value="3"
        type="number"
        min="1"
        max="5"
        step="1"
        name="complexity"
        id="complexityInput"
      />

      <label for="modifier">Industry Modifier:</label>
      <select name="modifier" id="industryInput">
        <option value="software">Software (x1.5)</option>
        <option value="web-design">Web Design (x1.5)</option>
      </select>

      <label for="caps">RESULTING CAPS:</label>
      <input
        disabled
        type="number"
        step="0.01"
        name="capsOutput"
        id="capsOutput"
      /> */}

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