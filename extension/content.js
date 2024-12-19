console.log("Google Slide投票システム: content.js loaded");

// iframeにショートカットキーを設定する
// ※Chrome拡張機能にショートカットキーを設定できるらしく、そっちで実現すればよかったと後で後悔しました。とほほ。
const setKeyEvent = (node) => {
  // googleSlideのフルスクリーンをつかさどるDOM要素を取得
  const iframeElement = node.querySelector(".punch-present-iframe");

  // iframeが見つからなければ処理をしない
  if (!iframeElement) {
    return;
  }

  console.log("Google Slide投票システム：iframe found");

  // 1秒待機してでDOMの読み込みを待つ
  setTimeout(() => {
    iframeElement.contentWindow.document.body.addEventListener("keydown", (event) => {
      console.log(`Google Slide投票システム：iframe key: ${event.key}, ctrl: ${event.ctrlKey}`);
      if (event.ctrlKey && event.key === 'q') {
        // モードを変更する
        iframeElement.classList.toggle("counter-view")
      }

      if (event.ctrlKey && event.key === 'k') {
        // 投票をカウントする
        const voteBar = document.querySelector(".vote-bar");
        if (voteBar) {
          const voteBarItems = voteBar.querySelectorAll(".vote-bar__item.not-active");

          // 未投票のバーがなければ処理をしない
          if (!voteBarItems || voteBarItems.length === 0) {
            return;
          }

          // 最後のバーをactiveにする
          voteBarItems[voteBarItems.length - 1].classList.remove("not-active");
        }
      }
    });
    console.log("Google Slide投票システム：iframe key event added");
  }, 1000);
}

const setVoteBar = (node) => {
  // スライドの表示がない場合は処理をしない
  if (!node.classList.contains("punch-full-screen-element")) {
    return;
  }

  console.log("Google Slide投票システム：full screen element found");

  let child = document.createElement('div');
  // バーを100個表示する
  for (let i = 0; i < 20; i++) {
    child.innerHTML += `<div class="vote-bar__item top20 not-active" />`;
  }
  for (let i = 0; i < 80; i++) {
    child.innerHTML += `<div class="vote-bar__item not-active" />`;
  }
  child.classList.add("vote-bar");
  node.appendChild(child);
}

// DOMの変更を検知する
const observer = new MutationObserver(records => {
  // 検知したDOMノードを調べる
  records.forEach(record => {
    // addedNodesで追加されたNodeを取得できる
    record.addedNodes.forEach(node => {
      // Nodeの変更でなければ処理をしない
      if(node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }
      setVoteBar(node);
      setKeyEvent(node);
    });
  })
})

observer.observe(document.body, {
  childList: true
});

getRoomCode = async () => {
  const data = await chrome.storage.local.get('roomCode')
  console.log(data)
  return data.roomCode;
}

// 設定されたルームコードを使ってログインする
const login = async () => {
  // ログイン情報を取得する
  const roomCode = await getRoomCode();
  console.log(roomCode)

  // ルームコードが設定されていない場合は処理をしない
  if (!roomCode) {
    return;
  }

  // ルームに入る
  const socket = io('https://handsup-seminar.onrender.com');
  console.log(socket)
}


login()
