import 'package:flutter/material.dart';
import 'router/app_router.dart';
import 'utils/theme.dart';

void main() {
  runApp(const WorkZenApp());
}

class WorkZenApp extends StatelessWidget {
  const WorkZenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'WorkZen',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      routerConfig: AppRouter.router,
    );
  }
}
