# chart-on-blog
블로그 게시글에 마크다운을 이용해 차트를 쉽게 그려주는 도구  

한 문단 안에 `- %%`로 시작한 다음 [`chart.js`](https://www.chartjs.org/) 로 그릴 data를 작성하고 `- %%`로 마무리해주면, 작성한 위치에 차트를 그려줍니다.

## 사용 방법
#### 1. HTML `<header> ... </header>`에 아래 문장 추가하기
```html
<header>
  ...
  
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <script src="https://rawcdn.githack.com/jaeyeon302/chart-on-blog/ffc3e842bd52bd92372c689d3a4acc51aed215d1/chart-on-blog.js"></script>
</header>
```
#### 2. 블로그 포스트에 차트 작성하기
```
# 제목
## 부제목

아래와 같이 작성하면 chart를 넣을 수 있어요

- %%
- type : pie
- data : 
  - labels : [red,blue,yellow]
  - datasets :
    - 0 :
      - data : [300,50,100]
      - backgroundColor : [#FF6384, #36A2EB, #FFCE56]
      - hoverBackgroundColor : [#FF6384, #36A2EB, #FFCE56]
- options :
- %%

```
> 위 데이터는 아래 json과 동치입니다.
```javascript
{
  "type" : "pie",
  "data" : {
    "labels" :["Red","Blue","Yellow"],
    "datasets" : [{
      "data" :[300,50,100],
      "backgroundColor" :[ "#FF6384", "#36A2EB", "#FFCE56" ],
      "hoverBackgroundColor" : [ "#FF6384", "#36A2EB", "#FFCE56" ]
      }]
  },
  "options" : {}
}    
```

## 데모
- [예제 링크](https://coconutzip.tistory.com/15)

## 참고자료
- [`chart.js`](https://www.chartjs.org/docs/latest/) : chart.js를 위한 `json` 작성법은 여기에서 배울 수 있습니다. 

## 상세 설명
- markdown list style로 작성됩니다. 
- (markdown 기준) `- %%` (unordered list) 로 시작해서 `- %%`로 닫아주면 해당 영역에 chart가 그려집니다
- `json`으로 작성해야할 때 따옴표(" ")로 묶어주어야하는 값들을 묶어주지 않고 작성할 수 있습니다
- 여러 데이터 셋은 `- 0 :`, `- 1 :`, `- 2 :` ... 식으로 list로 작성합니다.
``` javascript
{
"datasets" : [
      {
      "data" :[300,50,100],
      "backgroundColor" :[ "#FF6384", "#36A2EB", "#FFCE56" ],
      "hoverBackgroundColor" : [ "#FF6384", "#36A2EB", "#FFCE56" ]
      },
      {
      "data" :[100,50,300],
      "backgroundColor" :[ "#BCBCBC", "#EAEAEA", "#000000" ],
      "hoverBackgroundColor" : ["#BCBCBC", "#EAEAEA", "#000000" ]
      },
      {
      "data" :[50,50,350],
      "backgroundColor" :[ "#AC0909", "#BC0909", "#CD0909" ],
      "hoverBackgroundColor" : [ "#AC0909", "#BC0909", "#CD0909" ]
      }
      ]
}
```
> 위와 같은 여러 `datasets`는 아래와 같이 작성합니다.
```
- datasets :
  - 0 :
      - data : [300,50,100]
      - backgroundColor : [#FF6384, #36A2EB, #FFCE56]
      - hoverBackgroundColor : [#FF6384, #36A2EB, #FFCE56]
  - 1 :
      - data : [100,50,300]
      - backgroundColor : [#BCBCBC, #EAEAEA, #000000]
      - hoverBackgroundColor : [#BCBCBC, #EAEAEA, #000000]
  - 2 :
      - data : [50,50,350],
      - backgroundColor : [#AC0909, #BC0909, #CD0909]
      - hoverBackgroundColor : [#AC0909, #BC0909, #CD0909]
```

## 제한사항
- 아직 색상 값은 HEX(ex : #FFABFF) 만 지원합니다.
- options의 callback은 (ex : [Animation callback](https://www.chartjs.org/docs/latest/configuration/animations.html)) 지원하고 있지 않습니다.
