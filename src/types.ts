import type { ErrorObject } from 'ajv'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

export type { Ref } from 'vue'

export type ISchema = JSONSchema7Definition

export interface ISchemaObject extends JSONSchema7 {
  type: 'object'
  properties: {
    [key: string]: JSONSchema7Definition
  }
}

export interface ISchemaArray extends JSONSchema7 {
  type: 'array'
  items: JSONSchema7Definition
}

export interface IUiSchema {
  titles?: Array<string>
  order?: number
  properties?: { [key: string]: IUiSchema }
  disabled?: boolean,
  uiType?: string
  items?: IUiSchema
  cond?: (form: IAnyObject, path: string) => boolean
}

export type IErrorObject = ErrorObject<string, Record<string, any>, unknown>

type PropsFunction = (propName: string, schema: any, uiSchema?: IUiSchema, wrapper?: IComponent) => IAnyObject

export interface IComponent {
  component: any,
  props?: PropsFunction
}

export interface IConfigComponent {
  [key: string]: IComponent
}

export interface ILocalize extends Function {
  required?: string
}

export interface IAnyObject {
  [key:string] : any
}
