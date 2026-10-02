import { processCke } from '@/lib/queriesUtils';

export function transform(resp: any) {
	processCke(resp.entry?.aboutCke);
	processCke(resp.entry?.sectIntroCke);
	resp.entry?.topicCtn?.forEach(block => {
		processCke(block.sectIntroCke);
	});
}
