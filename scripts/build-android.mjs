import {build} from 'esbuild';
import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
if(!process.env.APP_API_URL||!/^https:\/\//.test(process.env.APP_API_URL))throw Error('APP_API_URL must be the deployed HTTPS website before building Android.');
await rm('android-web',{recursive:true,force:true});await mkdir('android-web',{recursive:true});
await cp('public','android-web',{recursive:true});
await build({entryPoints:['src/app.js'],bundle:true,format:'esm',outfile:'android-web/app.js',minify:true,define:{__API_URL__:JSON.stringify(process.env.APP_API_URL)}});await copyFile('src/style.css','android-web/style.css');
