
import { Meta } from './app.mjs';

async function main(meta: Meta): Promise<void>{
  
  const sourcefile: string = meta.arguments[0] ?? '';

  if(!sourcefile) console.log('must to set path of source-code');

  console.log(meta);
}

export default main;
