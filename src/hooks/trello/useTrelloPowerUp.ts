import { useEffect, useState } from 'react';

type TrelloPowerUpIframe = ReturnType<typeof TrelloPowerUp['iframe']>;

export const useTrelloPowerUp = (): TrelloPowerUpIframe | null => {
  const [trello, setTrello] = useState<TrelloPowerUpIframe | null>(null);

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && window.TrelloPowerUp) {
  //     setTrello(window.TrelloPowerUp.iframe());
  //   }
  // }, []);

  return trello;
};