# Callbacks

We've seen how we can modify the behavior and appearance of an embedded sketchfab model with init parameters.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  autospin: 0.2,
  scrollwheel: 0
});
```

We can also hook up our own code. The init function provides two callbacks: `success` and `error`. The success callback is used to perform actions once the model has loaded. You can do many things with the Sketchfab model, but only after is has been started. This calback is the only way to know when that is.

In this example, we log a message to the console when the model has been loaded and raise an error when there's an error wiht loading the sketchfab model.

```js
client.init("dGUrytaktlDeNudCEGKk31oTJY", {
  autostart: 1,
  success: (api) => console.log("Sketchfab API success", api),
  error: () => console.error("Sketchfab API error")
});
```

## API object

You see that the success callback passes an `api` object. This object is teh key to interacting with your model. Anything we do afterwards with the model, goes through this object.