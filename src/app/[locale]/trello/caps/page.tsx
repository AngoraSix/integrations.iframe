'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import './caps.css';

const CREDIT_RATIO = 2;
const AVG_COMPLEXITY = 3;

const TASK_TYPES = {
    ONE_OFF: {
        key: 'ONE_OFF'
    },
    CONTINUOUS_ACTIVITY: {
        key: 'CONTINUOUS_ACTIVITY'
    }
};

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

const ROLES_ACTIVITIES_MAPPNIGS = [
    {
        label: 'Traductor: Inglés',
        activities: [{
            label: 'Traducción - Inglés -> Español',
            hourlyRate: 4000,
            hourlyCaps: 0.5
        },
        {
            label: 'Interpretación - Español -> Inglés',
            hourlyRate: 7000,
            hourlyCaps: 0.7
        },
        {
            label: 'Traducción - Inglés -> Español',
            hourlyRate: 4500,
            hourlyCaps: 0.8
        },
        {
            label: 'Interpretación - Inglés -> Español',
            hourlyRate: 8500,
            hourlyCaps: 0.3
        }]
    },
    {
        label: 'Traductor: Portugués',
        activities: [
            {
                label: 'Traducción - Español -> Portugués',
                hourlyRate: 5000,
                hourlyCaps: 1.1
            },
            {
                label: 'Interpretación - Español -> Portugués',
                hourlyRate: 8000,
                hourlyCaps: 1.3
            },
            {
                label: 'Traducción - Portugués -> Español',
                hourlyRate: 5500,
                hourlyCaps: 1.6
            },
            {
                label: 'Interpretación - Portugués -> Español',
                hourlyRate: 9000,
                hourlyCaps: 0.9
            }]
    },
    {
        label: 'Administrador',
        activities: [
            {
                label: 'Coordinación de actividades',
                hourlyRate: 7500,
                hourlyCaps: 1.3
            }
        ]
    }
];

const INITIAL_STATE = {
    intiallyLoaded: false,

    selectedType: TASK_TYPES.ONE_OFF.key,

    roleIndex: 0,
    activityIndex: 0,
    hourlyRate: 0,

    effort: 0,
    complexity: 3,
    industry: '',
    industryModifier: 1,

    moneyPayment: 0,
    definedCaps: 0
};

export default function TrelloCapsPage() {
    const t = useTranslations('trello');

    const [cardState, setCardState] = useState(INITIAL_STATE);

    const [trelloService, setTrelloService] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.TrelloPowerUp && !trelloService) {
            const tService = trelloService || window.TrelloPowerUp.iframe();
            setTrelloService(tService);
            tService.render(() => {
                console.log("Trello update render callback called...");
            });
            tService.sizeTo('#caps');
        }
    }, []); // Empty dependency array so this effect runs only once.

    useEffect(() => {
        if (trelloService && !cardState.intiallyLoaded) {
            trelloService.get('card', 'shared', 'capsParams')
                .then((capsParams: {
                    effort: number;
                    complexity: number;
                    industry: string;
                    industryModifier?: number;
                    moneyPayment: number;
                    caps: number;
                }) => {
                    if (capsParams) {
                        const { effort, complexity, industry, industryModifier, moneyPayment, caps } = capsParams;
                        const resolvedIndustryModifier = (Number.isFinite(industryModifier) ? industryModifier : undefined)
                            ?? (industry ? INDUSTRIES[industry as keyof typeof INDUSTRIES]?.value : undefined);
                        // Use functional update to ensure you’re working with the latest state.
                        setCardState((prevState) => {
                            const updatedState = {
                                ...prevState,
                                intiallyLoaded: true,
                                effort,
                                complexity,
                                industry: industry ?? '',
                                industryModifier: resolvedIndustryModifier ?? prevState.industryModifier,
                                moneyPayment,
                                definedCaps: caps ?? prevState.definedCaps
                            };
                            return { ...updatedState, definedCaps: caps ?? _calcCaps(updatedState) };
                        });
                    }
                });
        }
    }, [trelloService, cardState.intiallyLoaded]); // Empty dependency array so this effect runs only once.

    const onInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericFields = ['effort', 'complexity', 'moneyPayment', 'roleIndex', 'activityIndex', 'industryModifier'];
        const rawValue = e.target?.value;
        const inputValue = numericFields.includes(fieldName) ? parseFloat(rawValue) : rawValue;
        const newState = { ...cardState, [fieldName]: inputValue };
        setCardState({ ...newState, definedCaps: _calcCaps(newState) });
    };

    const onSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (trelloService != null) {
            trelloService.set('card', 'shared', 'capsParams', {
                strategy: cardState.selectedType,
                effort: cardState.effort,
                complexity: cardState.complexity,
                industry: cardState.industry,
                industryModifier: (Number.isFinite(cardState.industryModifier) ? cardState.industryModifier : undefined)
                    ?? INDUSTRIES[cardState.industry as keyof typeof INDUSTRIES]?.value
                    ?? 1,
                moneyPayment: cardState.moneyPayment,
                caps: cardState.definedCaps,
            }).then(function () {
                trelloService.closePopup();
            });
        } else {
            console.log('Trello service not available');
        }
    };

    const _calcCaps = ({ effort, complexity, industry, industryModifier, selectedType, roleIndex, activityIndex, hourlyRate,
    }: { effort: number, complexity: number, industry: string, industryModifier?: number, selectedType: string, roleIndex: number, activityIndex: number, hourlyRate: number }) => {
        const resolvedModifier = (Number.isFinite(industryModifier) ? industryModifier : undefined)
            ?? (industry ? INDUSTRIES[industry as keyof typeof INDUSTRIES]?.value : undefined)
            ?? 1;
        return (selectedType === TASK_TYPES.ONE_OFF.key)
            ? (effort / CREDIT_RATIO) * (complexity / AVG_COMPLEXITY) * resolvedModifier
            : ROLES_ACTIVITIES_MAPPNIGS[roleIndex].activities[activityIndex].hourlyCaps;
    };

    return (
        <div id='caps' className='Trello__Caps Container'>
            <form className='Form' id="caps" onSubmit={onSubmit}>
                <div key={TASK_TYPES.ONE_OFF.key} className={`Fields__Container`}>
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

                    <div key="industryModifier"
                        id="industryModifier" className="InputField Industry">
                        <p
                            className="Label" id="industryModifier-label">{t('caps.form.industryModifier')}</p>
                        <input
                            type="number"
                            className="Input"
                            id="industryModifier"
                            value={cardState.industryModifier}
                            onChange={onInputChange('industryModifier')}
                            min="0.25"
                            max="3"
                            step="0.25"
                            precision="2"
                        />
                    </div>

                    <div key="moneyPayment"
                        id="moneyPayment" className="InputField MoneyPayment">
                        <p
                            className="Label" id="moneyPayment-label">{t('caps.form.moneyPayment')}</p>
                        <input
                            type="number"
                            className="Input"
                            id="moneyPayment"
                            value={cardState.moneyPayment}
                            onChange={onInputChange('moneyPayment')}
                            min="0"
                            max="1000000"
                            step="1"
                            precision="0"
                        />
                    </div>
                </div>
                <div key="caps" id="resultingCaps" className="InputField">
                    <p
                        className="Label" id="resultingCaps-label">{t('caps.form.resultingCaps')}</p>
                    <input
                        className="Input"
                        id="resultingCaps"
                        disabled
                        value={cardState.definedCaps}
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
