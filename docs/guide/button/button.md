# Button

The button component is a simple customizable button.

| Prop       | Description               | Accepted Values                 | Default     |
| :--------- | :------------------------ | :------------------------------ | :---------- |
| `label`    | The button's text         | -                               | `undefined` |
| `title`    | HTML title attribute      | -                               | `undefined` |
| `type`     | Visual type of button     | `default`, `outlined` or `text` | `default`   |
| `disabled` | HTML's disabled attribute | `true` or `false`               | `false`     |

| Event   | Description               | Parameters    |
| :------ | :------------------------ | :------------ |
| `click` | Triggered on button click | `$clickEvent` |

<<< @/guide/button/ButtonExample.vue

<ButtonExample />

<script setup>
import ButtonExample from './ButtonExample.vue'
</script>