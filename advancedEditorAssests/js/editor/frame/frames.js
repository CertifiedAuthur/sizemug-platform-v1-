angular
  .module("image.frames")

  .controller("FramesController", [
    "$scope",
    "$rootScope",
    "canvas",
    "simpleShapes",
    "history",
    "settings",
    function ($scope, $rootScope, canvas, simpleShapes, history, settings) {
      $scope.shapes = simpleShapes;
      $scope.opacity = 1.0;

      $rootScope.$on("settings.ready", function () {
        var frames = settings.get("frames");

        for (var i = frames.length - 1; i >= 0; i--) {
          frames[i].items = new Array(frames[i].items);
        }

        $scope.frameCategories = frames;
      });

      $scope.activeCategory = "modern";

      $scope.isPanelEnabled = function () {
        var obj = canvas.fabric.getActiveObject();
        return obj && obj.name === "frame" && $rootScope.activeTab === "frames";
      };

      $scope.setOpacity = function (opacity) {
        simpleShapes.getShape("frame").setOpacity(opacity);
        canvas.fabric.renderAll();
      };

      $scope.addFrameToCanvas = function (category, index, e) {
        if ($scope.loading) return;
        $scope.loading = true;

        fabric.util.loadImage("advancedEditorAssests/images/frames/" + category.name + "/" + index + "." + category.type, function (img) {
          var frame = new fabric.Image(img);
          frame.name = "frame";
          canvas.fabric.add(frame);
          frame.center();
          frame.setCoords();
          frame.scaleToHeight(canvas.fabric.getHeight()); // Resize the frame to fit the canvas height.

          canvas.fabric.setActiveObject(frame);
          canvas.fabric.renderAll();

          $scope.$apply(function () {
            $scope.loading = false;
          });

          history.add("Added: Frame", "favorite");
        });
      };
    },
  ]);
