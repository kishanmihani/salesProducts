export function alhabetelysort(data,name){
    const uniquePairsMap = new Map();
    data.forEach(item => {
        if (item?.[name] && !uniquePairsMap.has(item[name])) {
            uniquePairsMap.set(item[name], item);
        }
    });

    const uniqueKeyValuePairs = Array.from(uniquePairsMap.values());
    return uniqueKeyValuePairs?.sort((a, b)=>a?.[name].localeCompare(b?.[name]))
}