import type { ErrorObject, ValidateFunction } from 'ajv'
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema'

export type { Ref } from 'vue'
export type { KeywordDefinition } from 'ajv'

export type ISchema = JSONSchema7Definition

export interface ISchemaObject extends JSONSchema7 {
  type: 'object'
  properties: {
    [key: string]: JSONSchema7Definition
  }
}

export interface ISchemaArray extends JSONSchema7 {
  type: 'array'
  items: JSONSchema7Definition | JSONSchema7Definition[]
}

export interface IUiSchema {
  titles?: Array<string>
  order?: number
  properties?: { [key: string]: IUiSchema }
  disabled?: boolean
  uiType?: string
  items?: IUiSchema | IUiSchema[]
  cond?: (form: IAnyObject, path: string) => boolean
  additionalItems?: JSONSchema7Definition
  // component props
  [key: string]: unknown
}

export type IErrorObject = ErrorObject<string, Record<string, unknown>, unknown>

type PropsFunction = (propName: string, schema: IAnyObject, uiSchema?: IUiSchema, wrapper?: IComponent) => IAnyObject

export interface IComponent {
  component: unknown
  props?: PropsFunction
}

export interface IConfigComponent {
  [key: string]: IComponent
}

export type ILocalize = ((data: ValidateFunction<IAnyObject>['errors']) => void) & {
  required?: string
}

export interface IAnyObject {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
