# chart-on-blog
블로그 게시글에 마크다운을 이용해 차트를 쉽게 그려주는 도구  

한 문단 안에 `- %%`로 시작한 다음 [`chart.js`](https://www.chartjs.org/) 로 그릴 data를 작성하고 `- %%`로 마무리해주면, 작성한 위치에 차트를 그려줍니다.

## 사용 방법
#### 1. HTML `<header> ... </header>`에 아래 문장 추가하기
```html
<header>
  ...
  
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <script src="https://rawcdn.githack.com/jaeyeon302/chart-on-blog/adab9302c15b0f356ea7caf529dc35e46592f2eb/chart-on-blog.js"></script>
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
- [`chart.js`](https://www.chartjs.org/) : chart.js를 위한 `json` 작성법은 여기에서 배울 수 있습니다. 
- [`MathJax`](https://www.mathjax.org/#gettingstarted) : 수식 입력은 여기에서 배울 수 있습니다.

## 주의사항
- markdown list style로 작성됩니다. 
- (markdown 기준) `- %%` (unordered list) 로 시작해서 `- %%`로 닫아주면 해당 영역에 chart가 그려집니다
- 따옴표 ("")는 사용하지 않습니다. 숫자로 변환될 것들은 자동으로 변환됩니다.

## 제한사항
- 아직 색상 값은 HEX(ex : #FFABFF) 만 지원합니다.
- options의 callback은 (ex : [Animation callback](https://www.chartjs.org/docs/latest/configuration/animations.html)) 지원하고 있지 않습니다.
