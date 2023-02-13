export type { JSONSchema7 } from 'json-schema'

type SchemaTypeName = 'string' | 'number' | 'boolean' | 'object' | 'integer' | 'array'

// Schema types
export interface ISchemaBase {
  definitions?: { [key: string]: ISchemaBase }
  $ref?: string
  type: SchemaTypeName
  title?: string
  description?: string
  format?: string
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  default?: any
  properties?: { [key: string]: ISchema }
  enum?: Array<any>
  items?: ISchema
  allOf?: any[]
  oneOf?: any[]
  if?: any
  then?: any
}

export interface ISchemaObject extends ISchemaBase {
  type: 'object'
  properties: { [key: string]: ISchema }
  required?: string[]
}

export interface ISchemaSelect extends ISchemaBase {
  enum: Array<any>
}

export interface ISchemaArray extends ISchemaBase {
  type: 'array'
  items: ISchema
}

export type ISchema = ISchemaBase | ISchemaObject | ISchemaSelect | ISchemaArray

export type IDefinition = { [key: string] : ISchema }

export interface IUiSchema {
  titles?: Array<string>
  order?: number
  properties?: { [key: string]: IUiSchema }
  disabled?: boolean,
  uiType?: string
  items?: IUiSchema
}

// config types
type PropsFunction = (propName: string, schema: any, uiSchema?: IUiSchema, wrapper?: IComponent) => IAnyObject

export interface IComponent {
  component: any,
  props?: PropsFunction
}

export interface IConfigComponent {
  [key: string]: IComponent
}

// export interface IComponent {
//   componentName: string
//   eventName: string
//   props?: PropsFunction
// }

// export interface IWrapperComponent {
//   componentName: string,
//   props?: PropsFunction
// }

// export interface IConfigComponent {
//   matcher?: IAnyObject,
//   uiSchemaMatcher?: IAnyObject,
//   contains?: string,
//   componentName: string,
//   eventName: string,
//   props?: PropsFunction
// }

// common types
export interface IAnyObject {
  [key:string] : any
}