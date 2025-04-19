export function alhabetelysort(data,name){
    return data?.sort((a, b)=>a?.[name].localeCompare(b?.[name]))
}