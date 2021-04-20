#backendtask

##docker-composeで環境を構築
make start
を実行する事で、express, mysql, redisのdokcerが構築される。


##dockerの停止・再起動
make kill
または、

make down
でdockerを停止する。 再起動は

make restart
を実行。

##TEST方法
※ レスポンス（JSON）はjqを利用し、見やすくするとよい。

1. GET /movies
```
curl --header 'x-api-key:Quoo3ahvo6jiivaeKaep9aQuei8ceabi' -v 'http://localhost:3000/movies'
```

を実施する事で、API KEYを利用して、映画のリストを全て取得する。


2. GET /movies?search=xxx
```
curl --header 'x-api-key:Quoo3ahvo6jiivaeKaep9aQuei8ceabi' -v 'http://localhost:3000/movies?search='`echo '日本語' | nkf -WwMQ | tr = %`
```

を実施する事で、API KEYを利用して、映画のタイトル、説明から検索を行う。


3. POST /favorite/:id
```
curl -X POST -v 'http://localhost:3000/favorite/1'
```

を実施する事で、そのセッションに映画のIDが追加されていく。 ２回目以降は、レスポンスのセッションIDを用いる。

```
curl -X POST -b connect.sid=s%3AdEt9Nn5rMJWOnIn04f92L7PSH3rAbHbf.rBrhTLVVvXt8osH%2B3nsl%2BmMw8Rub9qtiLJsz5n9XgVI -v 'http://localhost:3000/favorite/2'
```

4. GET /favorites "3"で実施したレスポンスのセッションIDを用いて確認する。
```
curl -b connect.sid=s%3AdEt9Nn5rMJWOnIn04f92L7PSH3rAbHbf.rBrhTLVVvXt8osH%2B3nsl%2BmMw8Rub9qtiLJsz5n9XgVI -v 'http://localhost:3000/favorites'
```


## 振り返り
1週間の期間内で、実際に稼働できた時間は８時間程度で、docker（MySQL）の不安定で時間を使ってしまった。 課題は提出したとして、せっかく作ったので改善したい。

・パラメータのバリデーションが甘い。
・ORMを使う
・ルーターは別ファイルに切り出す。
・セッションの再作成に対応する。
・WEBサーバーをフロントに置く。
・フロントエンドに繋げてみる。
・定数はenvに切り出す。

上記はせめてやっておきたい所でした。
