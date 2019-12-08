import Flex from '../Flex'
import Box from '../Box'
import { baseProps } from '../config/props'
import { StringArray, NumberStringArray } from '../config/props/props.types'
import { forwardProps } from '../utils'

/**
 * Stack is a layout utility component that makes it easy to stack elements together and apply a space between them.
 * It composes the Flex component
 */
const Stack = {
  name: 'Stack',
  props: {
    direction: [String, Array],
    isInline: {
      type: Boolean,
      default: false
    },
    isReversed: {
      type: Boolean,
      default: false
    },
    align: StringArray,
    justify: StringArray,
    spacing: {
      type: NumberStringArray,
      default: 2
    },
    shouldWrapChildren: {
      type: Boolean,
      default: false
    },
    ...baseProps
  },
  render (h) {
    const _isReversed = this.isReversed || (this.direction && this.direction.endsWith('reverse'))
    const _isInline = this.isInline || (this.direction && this.direction.startsWith('row'))
    let _direction

    if (_isInline) {
      _direction = 'row'
    }

    if (_isReversed) {
      _direction = this.isInline ? 'row-reverse' : 'column-reverse'
    }

    if (this.direction) {
      _direction = this.direction
    }

    if (!_isInline && !_isReversed && !this.direction) {
      _direction = 'column'
    }

    const children = this.$slots.default
    console.log(children)
    const stackables = children.map((node, index) => {
      let isLastChild = children.length === index + 1
      let spacingProps = _isInline
        ? { [_isReversed ? 'ml' : 'mr']: isLastChild ? null : this.spacing }
        : { [_isReversed ? 'mt' : 'mb']: isLastChild ? null : this.spacing }

      const { propsData } = node.componentOptions
      // If children nodes should wrap, we wrap them inside block with
      // display set to inline block.
      if (this.shouldWrapChildren) {
        return h(Box, {
          props: {
            d: 'inline-block',
            ...spacingProps,
            ...forwardProps(this.$props)
          }
        }, [node])
      }

      // Otherwise we simply set spacing props to current node.
      node.componentOptions.propsData = {
        ...propsData,
        ...spacingProps
      }

      return node
    })

    return h(Flex, {
      props: {
        align: this.align,
        justify: this.justify,
        direction: _direction,
        ...forwardProps(this.$props)
      }
    }, stackables)
  }
}

export default Stack