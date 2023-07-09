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
  success: (api) => console.log("Sketchfab API success"),
  error: () => console.error("Sketchfab API error")
});
```

<iframe height="500" style="width: 100%;" scrolling="no" title="Sketchfab Model loading - init options" src="https://codepen.io/klaasnienhuis/embed/eYQeJVM/83086d655cab05d98f1e4e1632aba75b?default-tab=js%2Cresult&editable=true&theme-id=light" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/klaasnienhuis/pen/eYQeJVM/83086d655cab05d98f1e4e1632aba75b">
  Sketchfab Model loading - init options</a> by Klaas Nienhuis (<a href="https://codepen.io/klaasnienhuis">@klaasnienhuis</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## API object

You see that the success callback passes an `api` object. This object is teh key to interacting with your model. Anything we do afterwards with the model, goes through this object.