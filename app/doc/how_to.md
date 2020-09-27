# User interface

**Note:** in this section the *settings file* is the one located at *src/assets/json-data/settings.json*.

## Defaults

In the *settings file*, under `current` resides several properties.
These are the defaults that will be loaded when the simulator opens.
Their values refer to the `id` property of the element they represent (i.e. `current.theme` represents the `themes[?].id` property).

## Tabs

### Re-order the tabs

In the *settings file*, under `tabs` resides an array of all the tabs, it is safe to re-order the lines as you please.
But the `id`s **need** to be in the right order (i.e. first element of the array has the id `0`, the second one has `1`, etc.).

### Enable or disable buttons for a specific tab

In the *settings file* under `tabs`, every element of this array has the `buttons` array property.
Adding a button's label to this array will enable the button to be used (i.e. clicked) in this tab.

## Language

Languages are JSON data structures that are used to alter the text of the simulator.
They live in the *src/assets/json-data/strings/* folder.

**Note:** the simulator has been built with an initial set of 2 languages (English and French).
It has not been tested with languages using a non-latin alphabet.

### Add a new language

Copy the file *src/assets/json-data/strings/en.json* to a new file with the name of the language to add (e.g. *es.json* for Spanish).
Then in this new file, change the values (i.e. `Y86 Simulator` in `"documentTitle": "Y86 Simulator"`).

Then add your language in the *settings file* under the `languages` array.
To set it as the default language, see [this section](#defaults).

**Important:** in the *settings file* leave the `strings` element of your new language as an empty Object.
It will be filled when the simulator loads but needs to be initially instantiated as a String object.

### Add new strings to the simulator

Edit the *json* language files that live in *src/assets/json-data/strings/*.

When adding a new Vue component, use its Pascal Case name as the key (e.g. `ObjectCode`).
Use `ComponentName.title` for the header (`<h1>` or `<h2>`) of a component.

Since `App`'s `strings` property can change (when a user selects a new language in the settings dialog).
It's best to pass the strings to sub-components using Vue's dynamic properties (e.g. `v-bind:strings` or the shorter `:strings`).
But most components only use their strings, so this is why most have the `scopedStrings` property instead of `strings`.
It also simplifies the code in the component (e.g. `scopedStrings.title` instead of `strings.ComponentName.title`).
But requires passing the right element of `strings` to components (e.g. `<Editor :scopedStrings="strings.Editor" ... />`).

### Tweak existing strings

Edit the *json* language files that live in *src/assets/json-data/strings/*.
Only change the values (i.e. `Y86 Simulator` in `"documentTitle": "Y86 Simulator"`) otherwise it would break the language for the simulator.

## Theme

Themes are a set of colors that are used to alter the appearence of the simulator.
They live in the *public/css/themes/* folder.

### Add a new theme

Copy the file *public/css/themes/light.css* to a new file with the name of the new theme to add.
The first group of variables (i.e. `--accent` to `--success`) are the colors used in the theme.
Then most components have their own variables defined as `--ComponentName-<element>`.

Then add your theme in the *settings file* under the `themes` array.
To set it as the default theme, see [this section](#defaults).

**Note:** some Vue components such as the `Editor` do not only use the colors initially defined (e.g. `--Editor-comment`), so you would have to edit those colors directly in the component's group.

### Add new colors to the simulator

Edit the *css* theme files that live in *public/css/themes/*.

When adding a new component, use its Pascal Case name as the beginning of a variable's name (e.g. `--ObjectCode-`).
Then name the rest of the variable explicitly.
To refer to those variables in the `<style>` tag of the new component, use the code: `var(--ComponentName-background).`

### Tweak existing themes

Edit the *css* theme files that live in *public/css/themes/*.
And only change the values of these variables.

### Use the Editor's built-in theming capabilities

The `Editor` Vue component is made using [brace](https://github.com/thlorenz/brace), it has a built-in theme functionality.
But in this simulator, we define our own theme which uses the colors of the app's theme.
To use any of brace's built-in themes, open *src/components/Editor.vue* and in the `mounted` method, change `y86_sim` to the brace theme you'd like the `Editor` to use.

**Note:** you can find the list of brace's themes in the *node_modules/brace/theme* folder (if you've previously ran `npm install`) or in [this folder](https://github.com/thlorenz/brace/tree/master/theme) of brace's git repository.

# Model

## Add a new kernel

There are three steps to create a new kernel :

* Build it
* Install it
* Test it

### Build your kernel

In order to be valid, your kernel just has to implement the interface [ISimulator](../ts/model/interfaces/ISimulator.ts). As for `kernel-seq`, you can create a folder `ts/model/kernel-yourKernelName` where you will put every files specific to your kernel.

### Install your kernel

Now that your kernel is ready, we have to notify the rest of the world of its existence. To achieve that, we'll have to create and register its `toolchain` in [KernelController](../ts/controllers/kernelController.ts). At the end of the file, you can add your toolchain generation function using the `toolchainGenerator` map. In this function, you have to specify the dependencies of your kernel (compilers, instruction set, word size, etc...). Every time a kernel is changed, this function is called.

If you want to add specific default files (ys, hcl or instruction set) for your kernel, create the folder `src/assets/per-kernel-defaults/yourKernelName`. The default files must have the following names :

* y86.txt
* hcl.txt
* instructionSet.json

### Test your kernel

In order to test it, the application has to be built, using  :

```bash
npm run serve # Launch the development server (CLI mode not available)
# or
npm run prod # Launch the production server (CLI mode available)
```

Once the build is done, on the webapp, you can change the kernel in use using the **Settings** window, on the upper-right corner.
