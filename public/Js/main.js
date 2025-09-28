url = window.location.href;
console.log(url);

function StripURL(url)
{
  slashCount = 0;
  strippedUrl = "";
  for(let i = 0; i < url.length; i++)
  {
    const ch = url[i];
    if(ch === '/') slashCount++;
    strippedUrl += ch;
    if(slashCount === 3) return strippedUrl; 
  }
}

fetch('Cards.JSON')
  .then(response => response.json())
  .then(cards => {
    const section = document.getElementById('cardSection');
    cards.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card_container';
      cardDiv.innerHTML = `
        <div class="card_header" style="height: 100%; background-color: ${card.background_color};">
          <img src="${card.img}" alt="${card.name}">
        </div>
        <div class="card_body" style="color: ${card.color};">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi eu consectetur.</p>
        </div>
        <footer class="card_footer" style="background-color: ${card.background_color};">
          <button id='${card.name}' class="card_button">Play</button>
        </footer>
      `;
      const playButton = cardDiv.querySelector('.card_button');
      playButton.addEventListener('click', async (e) => {
        e.stopPropagation();
        const name = playButton.id;
        const params = new URLSearchParams(window.location.search);
        const value = params.get('match');
        const baseUrl = StripURL(url);

        console.log(name);

        switch(name)
        {
          case 'Tic Tac Toe':
            console.log("click tick");
            const tttUrl = baseUrl + 'ttt'
            response = await fetch(tttUrl, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({value})
            });
            responseData = await response.text();
            console.log(responseData);
            window.location.href = tttUrl;
            break;
          case 'Memory':
            console.log('click memory');
            const memoryUrl = baseUrl + 'memory'
            response = await fetch(memoryUrl, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({value})
            });
            responseData = await response.text();
            window.location.href = memoryUrl;
            
            break;
          default:
            break;
        }
      });
      section.appendChild(cardDiv);
    });
  });