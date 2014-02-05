## Pasting

- pasting multi lines within marked text breaks marks 
  - add mark(s) at end of first line
  - add mark(s) at start of last line
  - add mark(s) to start and end of all lines in between

## Mark Mode

- support switching to bold mode and keep typing with the result that all typed text is bolded

## Headers

- allow selecting headers (via shortcut?) and generate surround header markup
- change underlying lineheight or just add other stylings to visualize header (latter is easier)

## Links

- use `[` as start mark and `)` as end?

## nested marks

- now working properly
- making something bold + italic works somewhat (adds `***` on both ends)
- making part of an italic string bold not working at all
  - close italic right before bold string
  - reopen italic right after bold string
  - adjust start/end buddies
  - make bolded sting italic + bold
