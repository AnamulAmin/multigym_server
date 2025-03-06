import { takaFormatter } from "./formatterFunctions.js"

export function getNumberedListFromArray(projects, title, emoji) {

    let msg = ''

    msg += `${emoji + title + emoji}\n`

    if (projects.length > 0) {
        projects.forEach((p, index) => {
            msg += (
                `\n${index + 1}.` +
                ` Name: ${p.name}\n` +
                ` Client: ${p.client.name}\n` +
                ` Value: ${takaFormatter(p.amount)}\n`
            )
        });
    }

    if (projects.length === 0) {
        msg += `No Projects in ${title} Status.\n`
    }

    msg += '\n\n'

    return msg
    
}
// export function getNumberedListFromArray(array, listItem){

//     let list = ''

//     array.forEach((index) => {
//         list += `${index + 1}.  ${listItem}\n`
//     });

//     return list
// }