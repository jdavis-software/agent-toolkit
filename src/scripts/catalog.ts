const root = document.querySelector<HTMLElement>('[data-catalog]');
if (root) {
  const search = root.querySelector<HTMLInputElement>('#catalog-search')!;
  const origin = root.querySelector<HTMLSelectElement>('#origin-filter')!;
  const source = root.querySelector<HTMLSelectElement>('#source-filter')!;
  const cards = [...root.querySelectorAll<HTMLElement>('[data-entry]')];
  const kindButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-kind]')];
  const categoryButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-category]')];
  const count = root.querySelector<HTMLElement>('#result-count')!;
  const empty = root.querySelector<HTMLElement>('#empty-state')!;
  let kind = 'all'; let category = 'all';
  const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('en-US').trim();
  const valid = (value: string | null, choices: (string | undefined)[]) => value && choices.includes(value) ? value : 'all';
  function render(writeURL = true) {
    const terms = normalize(search.value).split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const match = terms.every(term => normalize(card.dataset.search ?? '').includes(term)) && (kind === 'all' || card.dataset.kind === kind) && (category === 'all' || card.dataset.category === category) && (origin.value === 'all' || card.dataset.origin === origin.value) && (source.value === 'all' || card.dataset.source === source.value);
      card.hidden = !match; if (match) visible++;
    });
    kindButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filterKind === kind)));
    categoryButtons.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filterCategory === category)));
    count.textContent = `Showing ${visible} of ${cards.length} entries`;
    empty.hidden = visible !== 0;
    if (writeURL) {
      const url = new URL(location.href);
      for (const [key,value] of Object.entries({q:search.value.trim(),kind,category,origin:origin.value,source:source.value})) {
        if (!value || value === 'all') url.searchParams.delete(key); else url.searchParams.set(key,value);
      }
      history.replaceState(null,'',url);
    }
  }
  function readURL() {
    const params = new URL(location.href).searchParams;
    search.value = params.get('q') ?? '';
    origin.value = valid(params.get('origin'),[...origin.options].map(option=>option.value));
    source.value = valid(params.get('source'),[...source.options].map(option=>option.value));
    kind = valid(params.get('kind'),kindButtons.map(button=>button.dataset.filterKind));
    category = valid(params.get('category'),categoryButtons.map(button=>button.dataset.filterCategory));
    render(false);
  }
  readURL();
  search.addEventListener('input',()=>render());
  origin.addEventListener('change',()=>render());
  source.addEventListener('change',()=>render());
  kindButtons.forEach(button=>button.addEventListener('click',()=>{kind=button.dataset.filterKind!;render();}));
  categoryButtons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filterCategory!;render();}));
  root.querySelector('#clear-filters')?.addEventListener('click',()=>{search.value='';origin.value='all';source.value='all';kind='all';category='all';render();});
  window.addEventListener('popstate',readURL);
  document.addEventListener('keydown',event=>{
    const target = event.target as HTMLElement;
    if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !target.closest('input,textarea,select,[contenteditable]')) {event.preventDefault();search.focus();}
  });
}
