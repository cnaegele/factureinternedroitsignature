import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import type { Employe } from '@/stores/datastore.ts'

let server: string = ''
if (import.meta.env.DEV) {
    server = 'https://mygolux.lausanne.ch'    
}

export interface Utilisateur {
  id_employe?: number
  nom_employe?: string
  prenom_employe?: string
  login_employe?: string
  groupesecurite?: string
  bingroupe?: number
  message?: string
}
export interface Service {
  iduo: number
  nomuo: string
  descriptionuo: string
  orderliste: string
  orderlisteparent: string
}
export interface Direction {
  iduo: number
  nomuo: string
  descriptionuo: string
  orderliste: string
  services: Service[]
}
export interface EmployeChoix {
  idemploye: number
  nom: string
  prenom: string
  bactif: number
  login: string
  unite: string
  directionabr?: string
  serviceabr?: string
}
export interface ApiResponseDS {
  success: boolean
  message: string
  data?: Direction[]
}
export interface ApiResponseEmpS {
  success: boolean
  message: string
  data?: Employe[]
}
export interface ApiResponseMessage {
  success: boolean
  message: string
}
// Interface générique pour les réponses API
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T[]
}

export async function getDataUserInfo(groupeSecurite: string): Promise<Utilisateur> {
    const page: string = '/goeland/gestion_spec/g_login_f5.php'
    const url: string = `${server}${page}`
    const params = new URLSearchParams([['groupesecurite', groupeSecurite]])
    const response: AxiosResponse<Utilisateur> = await axios.get(url, { params })
    console.log(response.data)
    return response.data
}

export async function getDirectionsServices(): Promise<ApiResponseDS> {
    const page: string = '/goeland/uniteorg/axios/uniteorg_directions_services_liste.php'
    const url: string = `${server}${page}`
    try {
        const response: AxiosResponse<Direction[]> = await axios.get(url)
        const respData: ApiResponseDS= {
            "success": true,
            "message": `ok`,
            "data": response.data
        }
        console.log(respData)
        return respData
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

export async function getEmployesSignataire(idUO: number): Promise<ApiResponseEmpS> {
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/afffactureint_empsignature_liste.php'
    const url: string = `${server}${page}`
    const params = new URLSearchParams([['iduniteorg', idUO.toString()]])
    try {
        const response: AxiosResponse<Employe[]> = await axios.get(url, { params })
        const respData: ApiResponseEmpS= {
            "success": true,
            "message": `ok`,
            "data": response.data
        }
        console.log(respData)
        return respData
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

export async function getEmployesListe(critere: string, bretInactif: boolean): Promise<EmployeChoix[]> {
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/employes_liste.php'
    const url: string = `${server}${page}`
    const params = new URLSearchParams([['scritere', critere], ['bretinactif', bretInactif.toString()]])
    const response: AxiosResponse<EmployeChoix[]> = await axios.get(url, { params })
    return response.data
}

export async function sauveMontantMax(idOrgunit: number, idEmploye: number, montantMax?: number): Promise<ApiResponseMessage> {
    if (typeof montantMax === 'undefined') {
        montantMax = 0.0
    }
    const odata = {
        idorgunit: idOrgunit,
        idemploye: idEmploye,
        montantmax: montantMax
    }
    const jdata: string = JSON.stringify(odata)
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/afffactureint_empsignature_montantmax_sauve.php'
    const url: string = `${server}${page}`
    try {
        const response: ApiResponseMessage = await axios.post(url, jdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        return response
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

export async function sauvePrincipal(idOrgunit: number, idEmploye: number): Promise<ApiResponseMessage> {
    const odata = {
        idorgunit: idOrgunit,
        idemploye: idEmploye
    }
    const jdata: string = JSON.stringify(odata)
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/afffactureint_empsignature_principal_sauve.php'
    const url: string = `${server}${page}`
    try {
        const response: ApiResponseMessage = await axios.post(url, jdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        return response
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

export async function supprimeDroitSignature(idOrgunit: number, idEmploye: number): Promise<ApiResponseMessage> {
    const odata = {
        idorgunit: idOrgunit,
        idemploye: idEmploye
    }
    const jdata: string = JSON.stringify(odata)
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/afffactureint_empsignature_supprime.php'
    const url: string = `${server}${page}`
    try {
        const response: ApiResponseMessage = await axios.post(url, jdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        return response
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

export async function sauveDroitSignature(idOrgunit: number, idEmploye: number): Promise<ApiResponseMessage> {
    const odata = {
        idorgunit: idOrgunit,
        idemploye: idEmploye
    }
    const jdata: string = JSON.stringify(odata)
    const page: string = '/goeland/gestion_spec/afffactureint_droitsignature/axios/afffactureint_empsignature_sauve.php'
    const url: string = `${server}${page}`
    try {
        const response: ApiResponseMessage = await axios.post(url, jdata, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log(response)
        return response
    } catch (error) {
        return traiteAxiosError(error as AxiosError)
    }
}

function traiteAxiosError<T>(error: AxiosError): ApiResponse<T> {
  let msgErr: string = ''
  if (error.response) {
    msgErr = `${error.response.data}<br>${error.response.status}<br>${error.response.headers}`    
  } else if (error.request.responseText) {
    msgErr = error.request.responseText
  } else {
    msgErr = error.message
  }
  const respData: ApiResponse<T> = {
    "success": false,
    "message": `ERREUR. ${msgErr}`,
  }
  return respData
}