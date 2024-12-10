'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import './caps.css';

const CREDIT_RATIO = 2;
const AVG_COMPLEXITY = 3;

const INDUSTRIES = {
    'software': {
        key: 'software',
        value: 1.5,
    },
    'web-design': {
        key: 'web-design',
        value: 1.5,
    },
    'business-analysis': {
        key: 'business-analysis',
        value: 1.5,
    }
};

export default function TrelloCapsPage() {
    const t = useTranslations('trello');

    const [cardState, setCardState] = useState({
        effort: 0,
        complexity: 3,
        industry: INDUSTRIES.software.key,
        definedCaps: null
    });

    const [trelloService, setTrelloService] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.TrelloPowerUp) {
            const tService = window.TrelloPowerUp.iframe();
            tService.render(function () {
                return tService.get('card', 'shared', 'capsParams')
                    .then(function (capsParams: { effort: number; complexity: number; industry: string; caps: number; }) {
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

    const onInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div id='caps' className='Trello__Caps Container' maxWidth="sm">
            <form className='Form' id="caps" onSubmit={onSubmit}>
                <div key="effort" id="effort" className="InputField Effort">
                    <p
                        className="Label" id="effort-label">{t('caps.form.effort')}</p>
                    <input
                        type="number"
                        className="Input"
                        id="effort"
                        value={cardState.effort}
                        onChange={onInputChange('effort')}
                        min="0"
                        max="30"
                        step="0.5"
                        precision="1"
                    />
                </div >

                <div key="complexity"
                    id="complexity" className="InputField Complexity">
                    <p
                        className="Label" id="complexity-label">{t('caps.form.complexity')}</p>
                    <input
                        type="number"
                        className="Input"
                        id="complexity"
                        value={cardState.complexity}
                        onChange={onInputChange('complexity')}
                        min="1"
                        max="5"
                        step="1"
                        precision="0"
                    />
                </div>

                <div key="industry"
                    id="industry" className="InputField Industry">
                    <p
                        className="Label" id="industry-label">{t('caps.form.industry')}</p>
                    <select
                        id="industry"
                        className="Input"
                        value={cardState.industry}
                        onChange={onInputChange('industry')}
                    >
                        {Object.keys(INDUSTRIES).map((key) => (<option key={key} value={key}>{t(`caps.form.industries.${key}`)}</option>))}
                    </select>
                </div>

                <div key="caps" id="resultingCaps" className="InputField">
                    <p
                        className="Label" id="resultingCaps-label">{t('caps.form.resultingCaps')}</p>
                    <input
                        className="Input"
                        id="resultingCaps"
                        disabled
                        value={_calcCaps(cardState)}
                    />
                </div>
                <input
                    type="submit"
                    color="primary"
                    variant="contained"
                    className="mod-primary"
                    value={t('caps.form.submit')} />
            </form>
        </div>
    );
}