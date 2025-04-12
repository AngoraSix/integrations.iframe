'use client';

import { Tab, Tabs } from '@mui/material';
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
    industry: INDUSTRIES.software.key,

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
            }
        }
    }, []); // Empty dependency array so this effect runs only once.

    useEffect(() => {
        if (trelloService && !cardState.intiallyLoaded) {
            trelloService.get('card', 'shared', 'capsParams')
                .then((capsParams: {
                    effort: number;
                    complexity: number;
                    industry: string;
                    moneyPayment: number;
                    caps: number;
                }) => {
                    console.log("Retrieved card powerup params:", capsParams);
                    const { effort, complexity, industry, moneyPayment, caps } = capsParams;
                    console.log("Initializing card powerup with params:", capsParams);
                    // Use functional update to ensure you’re working with the latest state.
                    setCardState((prevState) => ({
                        ...prevState,
                        intiallyLoaded: true,
                        effort,
                        complexity,
                        industry,
                        moneyPayment,
                        definedCaps: caps
                    }));
                })
                .then(() => {
                    console.log("Adjusting window");
                    // Adjust window size, then optionally indicate that you’re done.
                    trelloService.sizeTo('#caps').done();
                });
        } else {
            console.log("Trello service not available or already loaded.");
        };
    }, [trelloService, cardState.intiallyLoaded]); // Empty dependency array so this effect runs only once.

    const onInputChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target?.value;
        console.log(`Input changed: ${fieldName} = ${inputValue}`);
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
                industryModifier: INDUSTRIES[cardState.industry as keyof typeof INDUSTRIES].value,
                moneyPayment: cardState.moneyPayment,
                caps: cardState.definedCaps,
            }).then(function () {
                trelloService.closePopup();
            });
        } else {
            console.log('Trello service not available');
        }
    };

    const onTypeChange = (e: React.SyntheticEvent, newValue: string) => {
        setCardState({ ...cardState, ...INITIAL_STATE, selectedType: newValue });
    };

    const _calcCaps = ({ effort, complexity, industry, selectedType, roleIndex, activityIndex, hourlyRate,
    }: { effort: number, complexity: number, industry: string, selectedType: string, roleIndex: number, activityIndex: number, hourlyRate: number }) => {
        return (selectedType === TASK_TYPES.ONE_OFF.key)
            ? (effort / CREDIT_RATIO) * (complexity / AVG_COMPLEXITY) * INDUSTRIES[industry as keyof typeof INDUSTRIES].value
            : ROLES_ACTIVITIES_MAPPNIGS[roleIndex].activities[activityIndex].hourlyCaps;
    };

    const isContinuousActivity = cardState.selectedType === TASK_TYPES.CONTINUOUS_ACTIVITY.key;

    return (
        <div id='caps' className='Trello__Caps Container'>
            <form className='Form' id="caps" onSubmit={onSubmit}>
                <Tabs
                    variant="fullWidth"
                    className='Trello__Caps__StrategyType__Tabs'
                    value={cardState.selectedType}
                    onChange={onTypeChange}
                    aria-label="basic tabs example">
                    {Object.keys(TASK_TYPES).map(type => (
                        <Tab key={type}
                            value={TASK_TYPES[type].key}
                            id={`type-tab${type}`}
                            label={t(`caps.form.types.${type}`)}
                            className={`TypeTab ${type === cardState.selectedType ? 'Active' : 'Inactive'}`} />))}
                </Tabs>
                {isContinuousActivity
                    ? (<div key={TASK_TYPES.CONTINUOUS_ACTIVITY.key} className={`Fields__Container`}>
                        <div key="role"
                            id="role" className="InputField Role">
                            <p
                                className="Label" id="role-label">{t('caps.form.role')}</p>
                            <select
                                id="role"
                                className="Input"
                                value={cardState.roleIndex}
                                onChange={onInputChange('roleIndex')}
                            >
                                {ROLES_ACTIVITIES_MAPPNIGS.map((r, i) => (<option key={i} value={i}>{r.label}</option>))}
                            </select>
                        </div>
                        <div key="activity"
                            id="activity" className="InputField Role">
                            <p
                                className="Label" id="activity-label">{t('caps.form.activity')}</p>
                            <select
                                id="activity"
                                className="Input"
                                value={cardState.activityIndex}
                                onChange={onInputChange('activityIndex')}
                            >
                                {ROLES_ACTIVITIES_MAPPNIGS[cardState.roleIndex].activities.map((a, i) => (<option key={i} value={i}>{a.label}</option>))}
                            </select>
                        </div>
                        <div key="moneyPayment-perHour"
                            id="moneyPayment-perHour" className="InputField MoneyPayment__PerHour">
                            <p
                                className="Label" id="moneyPayment-perHour-label">{t('caps.form.moneyPayment-perHour')}</p>
                            <input
                                className="Input"
                                id="moneyPayment-perHour"
                                disabled
                                value={ROLES_ACTIVITIES_MAPPNIGS[cardState.roleIndex].activities[cardState.activityIndex].hourlyRate}
                            />
                        </div>
                    </div>)
                    : (<div key={TASK_TYPES.ONE_OFF.key} className={`Fields__Container`}>
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
                                step="250"
                                precision="0"
                            />
                        </div>
                    </div>)}
                <div key="caps" id="resultingCaps" className="InputField">
                    <p
                        className="Label" id="resultingCaps-label">{t(`caps.form.resultingCaps${isContinuousActivity ? '-perHour' : ''}`)}</p>
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
