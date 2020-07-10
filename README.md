# chart-on-blog
블로그 게시글에 마크다운을 이용해 차트를 쉽게 그려주는 도구  
한 문단에 `- %%`로 시작한 다음 [`chart.js`](https://www.chartjs.org/) 로 그릴 `JSON data`를 작성하고 `- %%`로 마무리해주면, 해당 영역의 텍스트를 `chart.js`를 위한 `json` 으로 만들어주고, 작성한 위치에 차트를 그려줍니다.

## 사용 방법
#### 1. HTML `<header> ... </header>`에 아래 문장 추가하기
```html
<header>
  ...
  
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <script src="https://rawcdn.githack.com/jaeyeon302/chart-on-blog/ea31a7fcd7f2487fc858f7c9f041835fd3b47836/chart-on-blog.js"></script>
</header>
```
#### 2. 블로그 포스트에 차트 작성하기
```
# 제목
## 부제목

- mathjax로 글도 쓰기도 하고
$$
f(x) = x^2
$$

- 아래와 같이 작성하면 글을 chart를 넣을 수 있어요

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
## 데모
- [예제 링크](https://coconutzip.tistory.com/15)

## 참고자료
- [`chart.js`](https://www.chartjs.org/) : chart.js를 위한 `json` 작성법은 여기에서 배울 수 있습니다. 
- [`MathJax`](https://www.mathjax.org/#gettingstarted) : 수식 입력은 여기에서 배울 수 있습니다.

## 주의사항
- markdown 기반으로 작성됩니다. 
- (markdown 기준) `- %%` (unordered list) 로 시작해서 `- %%`로 닫아주면 해당 영역에 chart가 그려집니다
- 따옴표 ("")는 사용하지 않습니다. 숫자로 변환될 것들은 자동으로 변환됩니다.
