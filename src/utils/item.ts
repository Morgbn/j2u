import type { ISchema, IUiSchema, IConfigComponent, IDefSchema, IAnyObject, IErrorObject } from '@/types'

function getType(schema: ISchema, components: IConfigComponent): string {
  if (typeof schema !== 'object') return 'object'
  if (schema.enum) return 'select'
  const { format, type } = schema
  if (format && components[format]) return format
  if (Array.isArray(type)) return type[0]
  return type ?? 'object'
}

function getSchema(schema: ISchema, defs: IDefSchema | IDefSchema[]): ISchema {
  if (typeof schema === 'boolean' || !schema.$ref) return schema
  const { $ref, ...full } = schema
  const arrOfDefs = Array.isArray(defs) ? defs : [defs]
  for (const d of arrOfDefs) {
    const attrs: string[] = $ref.split('#')[1].split('/').slice(1)
    let el: IAnyObject = d
    while (attrs.length && el) el = el[attrs.shift()!]
    if (el) return { ...el, ...full }
  }
  throw new Error(`Can not find ${$ref} in defsSchema`)
}

export function getItemInfo(
  name: string,
  schema: ISchema,
  uiSchema: IUiSchema,
  rootPath: string,
  components: IConfigComponent,
  wrappers: IConfigComponent,
  defsSchema: IDefSchema | IDefSchema[],
  errors?: IErrorObject[] | null,
  requiredEls?: string[]
) {
  schema = getSchema(schema, defsSchema)
  schema = typeof schema === 'boolean' ? {} : schema
  const { component: wrapper, props: fWrapper } = wrappers.item
  const wrapperArgs = fWrapper?.(name, schema, uiSchema) ?? {}
  const order = uiSchema.order
  const uiType = uiSchema.uiType ?? getType(schema, components)
  const path = `${rootPath}/${name}`
  const required = !!requiredEls?.includes(name)
  const readOnly = typeof schema !== 'boolean' ? schema.readOnly : false
  const error = errors?.find(e => e.instancePath === path)
  const cond = uiSchema.cond ?? null
  const { component, props: f } = components[uiType] ?? components.string
  const args = f?.(name, schema, uiSchema) ?? {}
  if (typeof schema !== 'boolean' && schema.type === 'array') args.name = name
  return { name, component, args, wrapper, wrapperArgs, path, required, readOnly, error, cond, order }
}
