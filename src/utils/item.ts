import type { ISchema, IUiSchema, IConfigComponent } from '@/types'

function getType (schema?: ISchema) {
  return !schema ? 'object' : schema.enum ? 'select' : schema.type
}

export function getItemInfo (name: string, schema: ISchema, uiSchema: IUiSchema, rootPath: string, components: IConfigComponent, wrappers: IConfigComponent, requiredEls?: string[]) {
  const { component: wrapper, props: fWrapper } = wrappers.item
  const wrapperArgs = fWrapper?.(name, schema, uiSchema) ?? {}
  const uiType = uiSchema.uiType ?? getType(schema)
  const path = `${rootPath}.${name}`
  const required = !!requiredEls?.includes(name)
  const { component, props: f } = components[uiType] ?? components.string
  const args = f?.(name, schema, uiSchema) ?? {}
  if (schema.type === 'object' || schema.type === 'array') {
    args.wrappers = wrappers
    args.components = components
  }
  if (schema.type === 'array') { args.name = name }
  return { name, component, args, wrapper, wrapperArgs, path, required }
}
