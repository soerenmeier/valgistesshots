import { processCke } from '@/lib/queriesUtils';

export function transform(resp: any) {
	processCke(resp.entry?.pageIntroCke);
	processCke(resp.entry?.aboutCke);
	processCke(resp.entry?.sectIntroCke);
}
