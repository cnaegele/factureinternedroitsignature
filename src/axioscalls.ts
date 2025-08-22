import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import type { Employe } from '@/stores/datastore.ts'

let server: string = ''
if (import.meta.env.DEV) {
    server = 'https://mygolux.lausanne.ch'    
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
// Interface générique pour les réponses API
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T[]
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