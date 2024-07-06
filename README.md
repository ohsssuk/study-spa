## 실행
```
npm run start
```

## 기능 구조
#### 구성 요소 및 동작 원리에 대한 설명
-----------------------------------------

### [App]
#### app.js의 APP 객체 : SPA 구성 목적
+ 웹 최초 실행 init() 으로 페이지 전환에 대한 renderApp() 이벤트 바인딩
+ 페이지 전환시 상시 renderApp() 실행
  + removeAppContent()으로 view 전체 초기화
  + removeAppContent()으로 view의 이벤트 리스너 전체 제거
  + route() 실행
    + pathname 구분하여 조건에 따라 Page 렌더링
#### USE
> + 신규 페이지는 route()의 조건문으로 추가
> + 서비스내에서 페이지간 이동은 App.naviageTo(${path})로 사용 (href 사용 금지)
-----------------------------------------

### [page]
#### page.js : route의 기준이 되는 각 페이지의 단위
#### extends Page의 구성요소
+ 모든 페이지 공통 사용 기능 this.cartMananer 생성
+ 모든 페이지 공통 사용 기능 this.header 생성
#### USE
> + setHeadTitle(title: string)
>   + 페이지 타이틀 변경
> + setHeader()
>   + 레이아웃에서 header 사용
> + generate(html: string)
>   + App에 html 추가 (append하기 때문에 완전 초기화가 필요한 경우는 App.removeAppContent() 우선 사용)
> + callAPI({ url: string, method?: "GET" | "POST" | "PUT" | "PATCH"| "DELETE", formData?: FormData })
>   + API 호출 공통 함수 {status, data, msg} 리턴
#### 현재 사용 페이지 & 주요 기능
+ products.js
  + 설정값(최대 표시 갯수, 현재 페이지, 검색) 변경마다 상품 목록, 페이지네이션 부분만 udpate (다른 부분은 리렌더링 하지 않음)
  + **설정값을 클래스 변수로 설정하기 때문에 추후 기획 요청시 변수값들을 보존하여 뒤로가기시 보고있던 동일 페이지 노출이 가능하도록 설계**
  + 최대 표시 갯수와 검색시에는 total이 변하기 때문에 오동작 방지를 위해 현재 페이지를 1로 초기화
+ productDetails.js
  + 장바구니 담기 기능 사용시 1개 이상만 담을 수 있도록 방지
  + 장바구니 담는 갯수가 변할 때 표시되는 가격이 변동되도록 update
  + CartManager 사용 (putCart())
+ cart.js
  + CartManager 데이터에 따라 리스트를 update
  + **현재는 없지만 상품을 추가하거나 갯수를 변경할 때에도 동일한 update 메소드를 사용할 수 있도록 설계**
#### 페이지는 App.generate(html)로 화면을 렌더링만 하면 이상이 없으므로 어느정도 자유로운 구성이 허용되지만 권장되는 구조
> + page 디렉토리 내에 위치
> + page 클래스 상속
> + render()
>   + route로 App 전체가 렌더링 될 때 실행하는 메소드(html 생성 부분과 이벤트 바인딩 부분을 모두 포함하는 가장 기본적인 구성)
>   + 이 메소드 내에서 상속 받은 page클래스의 메소드 실행(권장)
>   + component 사용시 해당 메소드 내에서 실행
> + update()
>   + 페이지 내의 인터렉션으로 화면이 변경될 경우(상품 목록 검색, 상품 목록 페이지 변경, 카트 담은 상품 삭제 등) 변경되는 부분에 대해서만 리렌더링하는 메소드의 모음
> + addEvent()
>   + 페이지에서 사용될 이벤트 리스너 모음
-----------------------------------------

### [component]
+ 재사용성이 높은 공통 요소
+ 완전히 독립적인 사용이 가능하도록 구성
#### 현재 사용 컴포넌트
+ backButton.js
  + 상품상세 페이지와 카트 페이지에서 사용되는 공통 뒤로가기 버튼 컴포넌트
+ header.js
  + 모든 페이지에서 사용중인 header 컴포넌트
+ cartManager.js
  + 장바구니를 컨트롤하는 클래스
+ pagination.js
  + 페이지네이션 컴포넌트
#### USE
#### Header navData 구성
```
new Header({
  navData: [
    { name: "메인", url: "/", key: "products" },
    { name: "장바구니", url: "/cart", key: "cart" },
  ],
});
```
#### CartManager
> + init()
>   + 카트매니저 인스턴스 생성시 localStorage에 저장된 장바구니 리스트 배열을 동기화
> + putCart({ productId, productTitle, productCount, productThumbnail })
>   + 인스턴스 배열 storedCart에 상품정보를 추가
>     + productId를 기준으로 검사하여 동일 상품이 있을 경우 productCount만 추가
>     + 동일 상품이 없을 경우는 상품 자체를 추가
>     + storedCart 업데이트로 view와 localStorage 싱크를 위해 updateSync() 실행
> + deleteCart(productId)
>   +  productId를 기준으로 storedCart에서 담긴 상품을 삭제
>   +  storedCart 업데이트로 view와 localStorage 싱크를 위해 updateSync() 실행
> + getCartList()
>   + 장바구니 페이지 표시를 위해 리스트 정보를 조회
> + getCartCount()
>   + 장바구니 갯수 조회
> + updateSync()
>   + 추가, 삭제로 장바구니 내용이 변하는 경우 view와 localStorage를 동일하게 변경해주기 위해 상시 실행하는 메소드
>   +  updatelocalStorage()
>     + localStorage 데이터 갱신
>   + updateView()
>     + view에서 변경되야할 부분 갱신 (ex: nav 장바구니 메뉴의 표시 갯수)

-----------------------------------------

### 특이사항
+ SPA 구성으로 인해 사용자 새로고침이나 첫 페이지 진입을 PATH가 있는 URL로 접근하는 경우 디렉토리가 없기 때문에 페이지를 찾지 못하는 에러
  +  http-server의 404.html 옵션 사용하여 메인 페이지로 리다이렉트 하도록 수정
