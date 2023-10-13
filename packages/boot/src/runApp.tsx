import React, { Fragment } from 'react';
import type { RouteObject } from 'react-router-dom';
import { BrowserRouter, HashRouter, useRoutes } from 'react-router-dom';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

interface ReactRouterAppProps {
  routes: RouteObject[];
}

interface AppContainerProps {
  providers?: React.ReactElement[];
  children: React.ReactNode;
}

export interface RunAppConfig {
  /**
   * 启动项配置
   */
  boot: {
    mountElement: HTMLElement;
    qiankun: false | { appName: string };
  };
  /**
   * 单个页面应用的根组件，适合不需要前端路由的情况
   */
  singleEntry?: React.ComponentType;
  /**
   * 多页应用路由配置, router.config 的快捷写法
   */
  routes: RouteObject[];
  /**
   * 路由配置
   */
  router?: {
    config: RouteObject[];
    type?: 'history' | 'hash';
  };
  /**
   * 根组件的父容器设置，传入的组件将一次作为应用根节点的父级组件
   */
  providers?: AppContainerProps['providers'];
}

function NotFound() {
  return <div>not found</div>;
}

function ReactRouterApp({ routes = [] }: ReactRouterAppProps) {
  if (!routes.find((route) => !route.path)) {
    // 如果用户没有定义 404 路由，则自动添加一个
    routes.push({
      path: '*',
      element: <NotFound />,
    });
  }
  return useRoutes(routes);
}

function AppContainer({ children: childrenProp, providers = [] }: AppContainerProps) {
  let children = childrenProp;
  if (providers && providers.length) {
    children = providers.reduce((prev, provider) => {
      if (React.isValidElement(provider)) {
        return React.cloneElement(provider, {}, prev);
      }
      return prev;
    }, childrenProp);
  }
  return children;
}

function runReactApp(config: RunAppConfig, root: Root) {
  let element;
  const routes = config.router?.config ?? config.routes;
  if (routes) {
    // react router app
    const routerType = config.router?.type ?? 'history';
    const Router = routerType === 'history' ? BrowserRouter : HashRouter;
    element = (
      <Router>
        <ReactRouterApp routes={routes} />
      </Router>
    );
  } else {
    // single entry app
    const SingleEntry = config.singleEntry || 'div';
    element = <SingleEntry />;
  }
  root.render(<AppContainer providers={config.providers}>{element}</AppContainer>);
}

function runQiankunApp(config: RunAppConfig, root: Root) {
  // FIXME: 需要支持从外层传入 mountId
  const mountId = '#root';
  return {
    bootstrap() {
      return Promise.resolve({});
    },

    mount() {
      runReactApp(config, root);
    },

    unmount() {
      root.unmount();
    },
  };
}

export function runApp(config: RunAppConfig) {
  const root = createRoot(config.boot.mountElement);

  if ((window as any).__POWERED_BY_QIANKUN__ && config.boot.qiankun) {
    runQiankunApp(config, root);
  } else {
    runReactApp(config, root);
  }
}
