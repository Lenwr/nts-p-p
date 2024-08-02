export interface customersType {
    nom : string
     prenoms : string
     adresse : string
    country : string
    telephone : string
    id: string
}export interface DataContextType {
    customers : customersType[] | null ;
    isLoading : boolean
    error : Error | null
}
