/**
 * Parses messages by the following template - %keyword1% [item1, item1, item1] %keyword2% [item2, item2, item2]
 * Returns a the name of the keyword if message includes a keyword not listed in templates
 * @param {string[]} templates
 * @param {string} message
 * @returns {{[p: string]: string[]} | string}
 */
import {TemplatedMessage} from "./parsers.interface";
interface _Template {
    [id: string]: string[];
}
export default function templateParser(templates: string[], message: string): TemplatedMessage | string {
    let fields: _Template = templates.reduce((map:  _Template, item: string) => {
        map[item] = [];
        return map;
    }, {_default: []});

    const lines = message.split('\n');

    // the keyword that's being matched
    let matching: string | undefined;
    for (let line of lines){
        const words = line.split(' ');
        for (let word of words){
            const match = word.replace('\n', '').match(/%(.*?)%/);
            if (match){
                if (!templates.includes(match[1])){
                    return match[1];
                }
                matching = match[1];
                continue;
            }
            if (!matching){
                fields._default.push(word)
            }
            else {
                fields[matching].push(word);
            }
        }
        // we know that there's an empty space between
        // each loop so we add a new line to the last destination
        if (!matching){
            fields._default.push('\n')
        }
        else {
            fields[matching].push('\n');
        }
    }

    return Object.keys(fields).reduce((map: TemplatedMessage, item: string) => {
        // we push \n into the array to preserve new line space
        // which means we join all new lines with extra spaces in front
        // so we want to make sure that we trim them out before we return the value
        map[item] = fields[item].join(' ').replace(/(^\s|\s$)/gm, '');
        return map;
    }, <TemplatedMessage> {});
}
