# poari: an issues board made with fresh

poari is maori word for board.

poari is an issue board for viewing issues across multiple projects, made with
deno, fresh, preact and tailwind.

this is an early alpha version, please report bug on github issues.

## development plans

main plan is to support github, gitlab, gitea and more issue sources, at the
moment github and gitlab public repositories are supported and provide a
confortable view.

for the moment drag and drop is supported over cards but nothing is stored,
neiter on client and server side.

code sources might need some refactoring but core feautures are covered and now
it's just time to do some test and fix and then figure out if there is some
interest for future developments.

feel free to reach out us through github issues on this repo, we would love to
get feedbacks, bug reports

## why fresh and deno

all runs in the client browser, so why fresh and deno? because deno.deploy is
awesome, developer experience with fresh is great and because of the
experimental nature of the project having a backend api ready might come useful
sooner or later.

## See it live !

thanks to deno.deploy we are live at https://poari.deno.dev

## Run locally

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Credits

### Fresh

Fresh: https://fresh.deno.dev/

### icons8

Logo: https://icons8.com/icon/set/military/dusk
